<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditStok;
use App\Models\DetailAudit;
use App\Models\StokCabang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuditController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = AuditStok::with(['cabang:id,nama_cabang', 'user:id,nama_lengkap'])
            ->withCount('detailAudit');

        if ($user->isKasir()) {
            $query->where('cabang_id', $user->cabang_id);
        } elseif ($request->filled('cabang_id')) {
            $query->where('cabang_id', $request->cabang_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $audit = $query->latest('tanggal_audit')->get();

        return response()->json(['success' => true, 'data' => $audit]);
    }

    public function show(int $id): JsonResponse
    {
        $audit = AuditStok::with([
            'cabang',
            'user:id,nama_lengkap',
            'detailAudit.produk:sku,nama_barang,merek',
        ])->findOrFail($id);

        $this->authorize('view', $audit);

        return response()->json(['success' => true, 'data' => $audit]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cabang_id' => 'required|integer|exists:cabang,id',
            'catatan'   => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        if ($user->isKasir() && $validated['cabang_id'] != $user->cabang_id) {
            return response()->json([
                'success' => false,
                'message' => 'Anda hanya bisa melakukan audit di cabang Anda sendiri.',
            ], 403);
        }

        $adaBerlangsung = AuditStok::where('cabang_id', $validated['cabang_id'])
            ->where('status', 'berlangsung')
            ->exists();

        if ($adaBerlangsung) {
            return response()->json([
                'success' => false,
                'message' => 'Ada sesi audit yang masih berlangsung di cabang ini. Selesaikan atau batalkan terlebih dahulu.',
            ], 422);
        }

        $audit = AuditStok::create([
            'cabang_id'     => $validated['cabang_id'],
            'tanggal_audit' => now(),
            'user_id'       => $user->id,
            'status'        => 'berlangsung',
            'catatan'       => $validated['catatan'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Sesi audit berhasil dimulai.',
            'data'    => $audit->load('cabang', 'user'),
        ], 201);
    }

    public function submitDetail(Request $request, int $id): JsonResponse
    {
        $audit = AuditStok::findOrFail($id);

        $this->authorize('update', $audit);

        if ($audit->status !== 'berlangsung') {
            return response()->json([
                'success' => false,
                'message' => 'Sesi audit ini sudah tidak aktif.',
            ], 422);
        }

        $validated = $request->validate([
            'items'             => 'required|array|min:1',
            'items.*.sku'       => 'required|string|exists:produk,sku',
            'items.*.stok_fisik'=> 'required|integer|min:0',
            'items.*.alasan'    => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['items'] as $item) {
                $stokCabang = StokCabang::where('sku', $item['sku'])
                    ->where('cabang_id', $audit->cabang_id)
                    ->first();

                $stokSistem = $stokCabang?->stok_saat_ini ?? 0;
                $selisih    = $stokSistem - $item['stok_fisik'];

                DetailAudit::updateOrCreate(
                    ['audit_id' => $audit->id, 'sku' => $item['sku']],
                    [
                        'cabang_id'   => $audit->cabang_id,
                        'stok_sistem' => $stokSistem,
                        'stok_fisik'  => $item['stok_fisik'],
                        'selisih'     => $selisih,
                        'alasan'      => $item['alasan'] ?? null,
                    ]
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => count($validated['items']) . ' item berhasil disubmit.',
                'data'    => $audit->load('detailAudit.produk'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function selesai(int $id): JsonResponse
    {
        $audit = AuditStok::with('detailAudit')->findOrFail($id);

        $this->authorize('update', $audit);

        if ($audit->status !== 'berlangsung') {
            return response()->json([
                'success' => false,
                'message' => 'Sesi audit ini sudah tidak aktif.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            foreach ($audit->detailAudit as $detail) {
                StokCabang::where('sku', $detail->sku)
                    ->where('cabang_id', $audit->cabang_id)
                    ->update(['stok_saat_ini' => $detail->stok_fisik]);
            }

            $audit->update(['status' => 'selesai']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Audit selesai. Stok sistem telah disesuaikan dengan stok fisik.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function batal(int $id): JsonResponse
    {
        $audit = AuditStok::findOrFail($id);

        $this->authorize('update', $audit);

        if ($audit->status !== 'berlangsung') {
            return response()->json([
                'success' => false,
                'message' => 'Sesi audit ini sudah tidak aktif.',
            ], 422);
        }

        $audit->update(['status' => 'dibatalkan']);

        return response()->json([
            'success' => true,
            'message' => 'Sesi audit dibatalkan.',
        ]);
    }
}