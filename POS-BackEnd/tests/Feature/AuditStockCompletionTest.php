<?php

namespace Tests\Feature;

use App\Models\AuditStok;
use App\Models\Cabang;
use App\Models\DetailAudit;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\StokCabang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditStockCompletionTest extends TestCase
{
    use RefreshDatabase;

    public function test_completion_applies_a_delta_to_current_stock_instead_of_overwriting_it(): void
    {
        $cabang = Cabang::create([
            'nama_cabang' => 'Cabang Uji',
            'alamat' => 'Jl. Uji',
        ]);

        $user = User::create([
            'nama_lengkap' => 'Admin Uji',
            'email' => 'admin@example.com',
            'password' => 'secret123',
            'role' => 'admin',
            'cabang_id' => $cabang->id,
        ]);

        $kategori = Kategori::create([
            'nama_kategori' => 'Test Kategori',
        ]);

        $produk = Produk::create([
            'sku' => 'SKU-TEST-001',
            'nama_barang' => 'Produk Uji',
            'kategori_id' => $kategori->id,
            'merek' => 'Merek Uji',
            'harga_beli' => 10000,
            'harga_eceran' => 15000,
            'harga_grosir' => 12000,
            'satuan' => 'pcs',
        ]);

        $stokCabang = StokCabang::create([
            'sku' => $produk->sku,
            'cabang_id' => $cabang->id,
            'stok_saat_ini' => 12,
            'minimum_stok' => 5,
        ]);

        $audit = AuditStok::create([
            'cabang_id' => $cabang->id,
            'tanggal_audit' => now(),
            'user_id' => $user->id,
            'status' => 'berlangsung',
            'catatan' => 'Uji delta stok',
        ]);

        DetailAudit::create([
            'audit_id' => $audit->id,
            'sku' => $produk->sku,
            'cabang_id' => $cabang->id,
            'stok_sistem' => 10,
            'stok_fisik' => 15,
            'selisih' => 5,
            'alasan' => 'Stok fisik berbeda',
        ]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/audit/' . $audit->id . '/selesai');

        $response->assertOk();
        $response->assertJsonFragment(['success' => true]);
        $this->assertSame(17, $stokCabang->fresh()->stok_saat_ini);
        $this->assertSame('selesai', $audit->fresh()->status);
    }
}
