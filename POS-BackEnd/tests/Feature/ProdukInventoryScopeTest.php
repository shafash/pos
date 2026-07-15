<?php

namespace Tests\Feature;

use App\Models\Cabang;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\StokCabang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProdukInventoryScopeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_sees_aggregated_stock_and_branch_breakdown(): void
    {
        $branchA = Cabang::create(['nama_cabang' => 'Cabang A', 'alamat' => 'Alamat A']);
        $branchB = Cabang::create(['nama_cabang' => 'Cabang B', 'alamat' => 'Alamat B']);

        $kategori = Kategori::create(['nama_kategori' => 'Minuman', 'deskripsi' => 'Minuman']);

        $produk = Produk::create([
            'sku' => 'SKU-INV-001',
            'nama_barang' => 'Air Mineral',
            'kategori_id' => $kategori->id,
            'merek' => 'Aqua',
            'harga_beli' => 10000,
            'harga_eceran' => 15000,
            'harga_grosir' => 14000,
            'satuan' => 'pcs',
        ]);

        StokCabang::create(['sku' => $produk->sku, 'cabang_id' => $branchA->id, 'stok_saat_ini' => 5, 'minimum_stok' => 2]);
        StokCabang::create(['sku' => $produk->sku, 'cabang_id' => $branchB->id, 'stok_saat_ini' => 3, 'minimum_stok' => 1]);

        $admin = User::create([
            'nama_lengkap' => 'Admin',
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('secret123'),
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/produk');

        $response->assertStatus(200)
            ->assertJsonPath('data.data.0.stok_saat_ini', 8)
            ->assertJsonPath('data.data.0.stok_total', 8)
            ->assertJsonCount(2, 'data.data.0.stok_per_cabang');
    }

    public function test_branch_user_only_sees_their_branch_stock(): void
    {
        $branchA = Cabang::create(['nama_cabang' => 'Cabang A', 'alamat' => 'Alamat A']);
        $branchB = Cabang::create(['nama_cabang' => 'Cabang B', 'alamat' => 'Alamat B']);

        $kategori = Kategori::create(['nama_kategori' => 'Minuman', 'deskripsi' => 'Minuman']);

        $produk = Produk::create([
            'sku' => 'SKU-INV-002',
            'nama_barang' => 'Teh Botol',
            'kategori_id' => $kategori->id,
            'merek' => 'Teh Botol',
            'harga_beli' => 8000,
            'harga_eceran' => 12000,
            'harga_grosir' => 11000,
            'satuan' => 'pcs',
        ]);

        StokCabang::create(['sku' => $produk->sku, 'cabang_id' => $branchA->id, 'stok_saat_ini' => 5, 'minimum_stok' => 2]);
        StokCabang::create(['sku' => $produk->sku, 'cabang_id' => $branchB->id, 'stok_saat_ini' => 3, 'minimum_stok' => 1]);

        $kasir = User::create([
            'nama_lengkap' => 'Kasir',
            'role' => 'kasir',
            'email' => 'kasir@example.com',
            'password' => bcrypt('secret123'),
            'cabang_id' => $branchA->id,
        ]);

        $response = $this->actingAs($kasir, 'sanctum')->getJson('/api/produk');

        $response->assertStatus(200)
            ->assertJsonPath('data.data.0.stok_saat_ini', 5)
            ->assertJsonPath('data.data.0.stok_total', 5)
            ->assertJsonCount(1, 'data.data.0.stok_per_cabang')
            ->assertJsonPath('data.data.0.stok_per_cabang.0.cabang_id', $branchA->id);
    }
}
