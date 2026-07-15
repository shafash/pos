<?php

namespace Tests\Feature;

use App\Models\Cabang;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReceiptTest extends TestCase
{
    use RefreshDatabase;

    public function test_receipt_page_is_available_for_a_transaction(): void
    {
        $cabang = Cabang::create([
            'nama_cabang' => 'Cabang Utama',
            'alamat' => 'Jl. Contoh No. 1',
        ]);

        $user = User::create([
            'nama_lengkap' => 'Kasir Satu',
            'role' => 'kasir',
            'email' => 'kasir@example.com',
            'password' => bcrypt('secret123'),
            'cabang_id' => $cabang->id,
        ]);

        $kategori = Kategori::create([
            'nama_kategori' => 'Minuman',
            'deskripsi' => 'Minuman',
        ]);

        $produk = Produk::create([
            'sku' => 'SKU-001',
            'nama_barang' => 'Air Mineral',
            'kategori_id' => $kategori->id,
            'merek' => 'Aqua',
            'harga_beli' => 15000,
            'harga_eceran' => 25000,
            'harga_grosir' => 23000,
            'satuan' => 'pcs',
        ]);

        $transaksi = Transaksi::create([
            'no_transaksi' => 'TRX-1001',
            'waktu' => now(),
            'total_bayar' => 25000,
            'metode_pembayaran' => 'cash',
            'status' => 'lunas',
            'user_id' => $user->id,
            'id_member' => null,
            'cabang_id' => $cabang->id,
        ]);

        $transaksi->detailTransaksi()->create([
            'sku' => $produk->sku,
            'kuantitas' => 1,
            'harga_satuan' => 25000,
            'subtotal' => 25000,
        ]);

        $response = $this->get('/receipt/' . $transaksi->no_transaksi);

        $response->assertStatus(200);
        $response->assertSee('STRUK PENJUALAN');
        $response->assertSee($transaksi->no_transaksi);
    }
}
