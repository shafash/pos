<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produk;
use App\Models\StokCabang;
use App\Models\Kategori;
use App\Support\IdGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProdukController extends Controller
{
    /**
     * GET /api/produk
     */
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
        $user       = $request->user();
        // If user is kasir, force cabang scope to user's cabang
        $cabangId   = $user && $user->isKasir() ? $user->cabang_id : $request->cabang_id;

        $data = $produkList->map(function ($produk) use ($cabangId) {
            $stokCabang = $cabangId
                ? $produk->stokCabang->firstWhere('cabang_id', $cabangId)
                : null;

            return [
                'sku'             => $produk->sku,
                'nama_barang'     => $produk->nama_barang,
                'merek'           => $produk->merek,
                'kategori'        => $produk->kategori?->nama_kategori,
                'kategori_id'     => $produk->kategori_id,
                'harga_beli'      => $produk->harga_beli,
                'harga_eceran'    => $produk->harga_eceran,
                'harga_grosir'    => $produk->harga_grosir,
                'satuan'          => $produk->satuan,
                'foto_url'        => $produk->foto_url,  // ← URL lengkap foto
                'stok_saat_ini'   => $stokCabang?->stok_saat_ini,
                'minimum_stok'    => $stokCabang?->minimum_stok,
                'perlu_restock'   => $stokCabang ? $stokCabang->perlu_restock : null,
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

    /**
     * GET /api/produk/{sku}
     */
    public function show(string $sku): JsonResponse
    {
        $produk = Produk::with(['kategori', 'stokCabang.cabang'])->findOrFail($sku);

        return response()->json([
            'success' => true,
            'data'    => array_merge($produk->toArray(), [
                'foto_url' => $produk->foto_url,
            ]),
        ]);
    }

    /**
     * POST /api/produk
     * Support multipart/form-data untuk upload foto sekaligus tambah produk
     */
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
            'foto'         => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // max 2MB
        ]);

        DB::beginTransaction();
        try {
            $sku      = $validated['sku'] ?? $this->generateSku($validated['merek'] ?? $validated['nama_barang']);
            $fotoPath = null;

            // Simpan foto kalau ada
            if ($request->hasFile('foto')) {
                $fotoPath = $request->file('foto')->storeAs(
                    'produk',
                    $sku . '.' . $request->file('foto')->extension(),
                    'public'
                );
            }

            $produk = Produk::create([
                'sku'          => $sku,
                'nama_barang'  => $validated['nama_barang'],
                'kategori_id'  => $validated['kategori_id'],
                'merek'        => $validated['merek'] ?? null,
                'harga_beli'   => $validated['harga_beli'],
                'harga_eceran' => $validated['harga_eceran'],
                'harga_grosir' => $validated['harga_grosir'] ?? round($validated['harga_eceran'] * 0.9),
                'satuan'       => $validated['satuan'] ?? 'pcs',
                'foto'         => $fotoPath,
            ]);

            // Buat baris stok untuk semua cabang
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
                'success'  => true,
                'message'  => 'Produk berhasil ditambahkan.',
                'data'     => array_merge(
                    $produk->load('kategori', 'stokCabang.cabang')->toArray(),
                    ['foto_url' => $produk->foto_url]
                ),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            // Hapus foto yang sudah terupload kalau ada error
            if ($fotoPath) Storage::disk('public')->delete($fotoPath);

            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan produk: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUT /api/produk/{sku}
     * Update data produk (bukan foto — foto pakai endpoint terpisah)
     */
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
            'data'    => array_merge(
                $produk->fresh()->load('kategori', 'stokCabang.cabang')->toArray(),
                ['foto_url' => $produk->fresh()->foto_url]
            ),
        ]);
    }

    /**
     * POST /api/produk/{sku}/foto
     * Upload atau ganti foto produk
     */
    public function uploadFoto(Request $request, string $sku): JsonResponse
    {
        $produk = Produk::findOrFail($sku);

        $request->validate([
            'foto' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Hapus foto lama kalau ada
        if ($produk->foto) {
            Storage::disk('public')->delete($produk->foto);
        }

        // Simpan foto baru dengan nama SKU
        $fotoPath = $request->file('foto')->storeAs(
            'produk',
            $sku . '.' . $request->file('foto')->extension(),
            'public'
        );

        $produk->update(['foto' => $fotoPath]);

        return response()->json([
            'success'  => true,
            'message'  => 'Foto produk berhasil diperbarui.',
            'foto_url' => $produk->fresh()->foto_url,
        ]);
    }

    /**
     * DELETE /api/produk/{sku}
     */
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

        // Hapus foto kalau ada
        if ($produk->foto) {
            Storage::disk('public')->delete($produk->foto);
        }

        $produk->delete();

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    /**
     * PUT /api/produk/{sku}/stok
     */
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

        $this->authorize('update', $stok);

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

    /**
     * GET /api/kategori
     */
    public function kategori(): JsonResponse
    {
        $kategori = Kategori::orderBy('nama_kategori')->get();
        return response()->json(['success' => true, 'data' => $kategori]);
    }

    // ── Private helpers ──────────────────────────────────────

    private function generateSku(string $merek): string
    {
        return app(IdGenerator::class)->produkSku($merek);
    }
}