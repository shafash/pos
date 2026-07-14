<?php

namespace Tests\Feature;

use App\Models\Kategori;
use App\Models\Produk;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProdukPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_returns_paginated_products_with_metadata(): void
    {
        $user = User::create([
            'nama_lengkap' => 'Admin Test',
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $kategori = Kategori::create(['nama_kategori' => 'Test Kategori']);
        $produk = Produk::create([
            'sku' => 'TEST-001',
            'nama_barang' => 'Test Product',
            'kategori_id' => $kategori->id,
            'harga_beli' => 10000,
            'harga_eceran' => 15000,
            'harga_grosir' => 14000,
            'satuan' => 'pcs',
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/produk?per_page=1');

        $response->assertOk();
        $response->assertJsonStructure([
            'success',
            'data' => [
                'data' => [[
                    'sku',
                    'nama_barang',
                ]],
                'current_page',
                'per_page',
                'total',
                'last_page',
            ],
        ]);
        $this->assertSame(1, $response->json('data.per_page'));
        $this->assertSame($produk->sku, $response->json('data.data.0.sku'));
    }
}
