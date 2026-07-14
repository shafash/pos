<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\StokCabang;
use App\Support\CartItemMerger;
use App\Support\IdGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Transaksi::with([
            'user:id,nama_lengkap',
            'member:id_member,nama_member',
            'cabang:id,nama_cabang',
            'detailTransaksi.produk:sku,nama_barang,merek',
        ]);

        $user = $request->user();
        if ($user->isKasir()) {
            $query->where('cabang_id', $user->cabang_id);
        } elseif ($request->filled('cabang_id')) {
            $query->where('cabang_id', $request->cabang_id);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('waktu', $request->tanggal);
        }

        $limit  = $request->input('limit', 20);
        $transaksi = $query->latest('waktu')->paginate($limit);

        return response()->json(['success' => true, 'data' => $transaksi]);
    }

    public function show(string $noTransaksi): JsonResponse
    {
        $transaksi = Transaksi::with([
            'user:id,nama_lengkap',
            'member',
            'cabang:id,nama_cabang',
            'detailTransaksi.produk',
        ])->findOrFail($noTransaksi);

        $this->authorize('view', $transaksi);

        return response()->json(['success' => true, 'data' => $transaksi]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'metode_pembayaran'  => 'required|in:cash,debit,kredit,qris,transfer',
            'id_member'          => 'nullable|string|exists:member,id_member',
            'items'              => 'required|array|min:1',
            'items.*.sku'        => 'required|string|exists:produk,sku',
            'items.*.kuantitas'  => 'required|integer|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        $user     = $request->user();
        $cabangId = $user->cabang_id;

        if ($user->isAdmin() || $user->isOwner()) {
            $request->validate(['cabang_id' => 'required|integer|exists:cabang,id']);
            $cabangId = $request->cabang_id;
        }

        DB::beginTransaction();
        try {
            $mergedItems = app(CartItemMerger::class)->merge($validated['items']);
            $totalBayar  = 0;
            $itemsInsert = [];

            foreach ($mergedItems as $item) {
                $stok = StokCabang::where('sku', $item['sku'])
                    ->where('cabang_id', $cabangId)
                    ->lockForUpdate()
                    ->first();

                if (! $stok) {
                    throw new \Exception("Produk {$item['sku']} tidak terdaftar di cabang ini.");
                }

                if ($stok->stok_saat_ini < $item['kuantitas']) {
                    throw new \Exception("Stok produk {$item['sku']} tidak mencukupi. Stok tersedia: {$stok->stok_saat_ini}.");
                }

                $subtotal     = $item['kuantitas'] * $item['harga_satuan'];
                $totalBayar  += $subtotal;

                $itemsInsert[] = [
                    'sku'          => $item['sku'],
                    'kuantitas'    => $item['kuantitas'],
                    'harga_satuan' => $item['harga_satuan'],
                    'subtotal'     => $subtotal,
                    'stok'         => $stok,
                ];
            }

            $noTransaksi = $this->generateNoTransaksi();

            $transaksi = Transaksi::create([
                'no_transaksi'      => $noTransaksi,
                'waktu'             => now(),
                'total_bayar'       => $totalBayar,
                'metode_pembayaran' => $validated['metode_pembayaran'],
                'status'            => 'lunas',
                'user_id'           => $user->id,
                'id_member'         => $validated['id_member'] ?? null,
                'cabang_id'         => $cabangId,
            ]);

            foreach ($itemsInsert as $item) {
                $transaksi->detailTransaksi()->create([
                    'sku'          => $item['sku'],
                    'kuantitas'    => $item['kuantitas'],
                    'harga_satuan' => $item['harga_satuan'],
                    'subtotal'     => $item['subtotal'],
                ]);

                $item['stok']->decrement('stok_saat_ini', $item['kuantitas']);
            }

            if ($validated['id_member']) {
                $poinBaru = (int) floor($totalBayar / 10000);
                $member = \App\Models\Member::find($validated['id_member']);
                if ($member) {
                    $member->increment('poin', $poinBaru);
                    $this->updateTierMember($member);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil.',
                'data'    => $transaksi->load('detailTransaksi.produk', 'member', 'user', 'cabang'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    public function batal(string $noTransaksi): JsonResponse
    {
        $transaksi = Transaksi::with('detailTransaksi')->findOrFail($noTransaksi);

        $this->authorize('update', $transaksi);

        if ($transaksi->status === 'batal') {
            return response()->json([
                'success' => false,
                'message' => 'Transaksi sudah dibatalkan sebelumnya.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            foreach ($transaksi->detailTransaksi as $detail) {
                StokCabang::where('sku', $detail->sku)
                    ->where('cabang_id', $transaksi->cabang_id)
                    ->increment('stok_saat_ini', $detail->kuantitas);
            }

            $transaksi->update(['status' => 'batal']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaksi berhasil dibatalkan dan stok dikembalikan.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function generateNoTransaksi(): string
    {
        return app(IdGenerator::class)->transaksiNo();
    }

    private function updateTierMember(\App\Models\Member $member): void
    {
        $tier = match (true) {
            $member->poin >= 10000 => 'platinum',
            $member->poin >= 7000  => 'gold',
            $member->poin >= 3000  => 'silver',
            default                => 'bronze',
        };

        $member->update(['tier_loyalty' => $tier]);
    }
}