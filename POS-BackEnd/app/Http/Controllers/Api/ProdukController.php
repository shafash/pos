<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\StokCabang;
use App\Models\Kategori;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProdukController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Produk::with(['kategori', 'stokCabang.cabang']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_barang', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('merek', 'like', "%{$search}%");
            });
        }

        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }

        $produkList = $query->orderBy('nama_barang')->get();

        $cabangId = $request->cabang_id;

        $data = $produkList->map(function ($produk) use ($cabangId) {
            $stokCabang = $cabangId
                ? $produk->stokCabang->firstWhere('cabang_id', $cabangId)
                : null;

            return [
                'sku'            => $produk->sku,
                'nama_barang'    => $produk->nama_barang,
                'merek'          => $produk->merek,
                'kategori'       => $produk->kategori?->nama_kategori,
                'kategori_id'    => $produk->kategori_id,
                'harga_beli'     => $produk->harga_beli,
                'harga_eceran'   => $produk->harga_eceran,
                'harga_grosir'   => $produk->harga_grosir,
                'satuan'         => $produk->satuan,
                'stok_saat_ini'  => $stokCabang?->stok_saat_ini,
                'minimum_stok'   => $stokCabang?->minimum_stok,
                'perlu_restock'  => $stokCabang ? $stokCabang->perlu_restock : null,
                'stok_per_cabang' => $produk->stokCabang->map(fn($s) => [
                    'cabang_id'     => $s->cabang_id,
                    'nama_cabang'   => $s->cabang?->nama_cabang,
                    'stok_saat_ini' => $s->stok_saat_ini,
                    'minimum_stok'  => $s->minimum_stok,
                    'perlu_restock' => $s->perlu_restock,
                ]),
            ];
        });

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function show(string $sku): JsonResponse
    {
        $produk = Produk::with(['kategori', 'stokCabang.cabang'])->findOrFail($sku);

        return response()->json([
            'success' => true,
            'data'    => $produk->load('kategori', 'stokCabang.cabang'),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sku'          => ['nullable', 'string', 'max:30', Rule::unique('produk', 'sku')],
            'nama_barang'  => 'required|string|max:150',
            'kategori_id'  => 'required|integer|exists:kategori,id',
            'merek'        => 'nullable|string|max:100',
            'harga_beli'   => 'required|numeric|min:0',
            'harga_eceran' => 'required|numeric|min:0',
            'harga_grosir' => 'nullable|numeric|min:0',
            'satuan'       => 'nullable|string|max:20',
            'stok_awal'    => 'nullable|integer|min:0',
            'minimum_stok' => 'nullable|integer|min:0',
        ]);

        DB::beginTransaction();
        try {
            $sku = $validated['sku'] ?? $this->generateSku($validated['merek'] ?? $validated['nama_barang']);

            $produk = Produk::create([
                'sku'          => $sku,
                'nama_barang'  => $validated['nama_barang'],
                'kategori_id'  => $validated['kategori_id'],
                'merek'        => $validated['merek'] ?? null,
                'harga_beli'   => $validated['harga_beli'],
                'harga_eceran' => $validated['harga_eceran'],
                'harga_grosir' => $validated['harga_grosir'] ?? round($validated['harga_eceran'] * 0.9),
                'satuan'       => $validated['satuan'] ?? 'pcs',
            ]);

            $cabangList = DB::table('cabang')->pluck('id');
            foreach ($cabangList as $cabangId) {
                StokCabang::create([
                    'sku'           => $produk->sku,
                    'cabang_id'     => $cabangId,
                    'stok_saat_ini' => $validated['stok_awal'] ?? 0,
                    'minimum_stok'  => $validated['minimum_stok'] ?? 0,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil ditambahkan.',
                'data'    => $produk->load('kategori', 'stokCabang.cabang'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan produk: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, string $sku): JsonResponse
    {
        $produk = Produk::findOrFail($sku);

        $validated = $request->validate([
            'nama_barang'  => 'sometimes|string|max:150',
            'kategori_id'  => 'sometimes|integer|exists:kategori,id',
            'merek'        => 'nullable|string|max:100',
            'harga_beli'   => 'sometimes|numeric|min:0',
            'harga_eceran' => 'sometimes|numeric|min:0',
            'harga_grosir' => 'nullable|numeric|min:0',
            'satuan'       => 'nullable|string|max:20',
        ]);

        $produk->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil diperbarui.',
            'data'    => $produk->fresh()->load('kategori', 'stokCabang.cabang'),
        ]);
    }

    public function destroy(string $sku): JsonResponse
    {
        $produk = Produk::findOrFail($sku);

        $adaTransaksi = DB::table('detail_transaksi')->where('sku', $sku)->exists();
        if ($adaTransaksi) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak bisa dihapus karena sudah pernah ada dalam transaksi.',
            ], 422);
        }

        $produk->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    public function updateStok(Request $request, string $sku): JsonResponse
    {
        $validated = $request->validate([
            'cabang_id'     => 'required|integer|exists:cabang,id',
            'stok_saat_ini' => 'required|integer|min:0',
            'minimum_stok'  => 'nullable|integer|min:0',
        ]);

        $stok = StokCabang::where('sku', $sku)
            ->where('cabang_id', $validated['cabang_id'])
            ->firstOrFail();

        $stok->update([
            'stok_saat_ini' => $validated['stok_saat_ini'],
            'minimum_stok'  => $validated['minimum_stok'] ?? $stok->minimum_stok,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stok berhasil diperbarui.',
            'data'    => $stok->fresh(),
        ]);
    }

    public function kategori(): JsonResponse
    {
        $kategori = Kategori::orderBy('nama_kategori')->get();

        return response()->json(['success' => true, 'data' => $kategori]);
    }

    private function generateSku(string $merek): string
    {
        $prefix = strtoupper(substr(str_replace(' ', '', $merek), 0, 3));
        $lastNumber = Produk::where('sku', 'like', "{$prefix}-%")->count();
        $nextNumber = str_pad((string) ($lastNumber + 1), 3, '0', STR_PAD_LEFT);
        return "{$prefix}-{$nextNumber}";
    }
}