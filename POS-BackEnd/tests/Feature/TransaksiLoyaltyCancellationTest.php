<?php

namespace Tests\Feature;

use App\Models\Cabang;
use App\Models\DetailTransaksi;
use App\Models\Kategori;
use App\Models\Member;
use App\Models\Produk;
use App\Models\StokCabang;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransaksiLoyaltyCancellationTest extends TestCase
{
    use RefreshDatabase;

    public function test_cancelling_transaction_deducts_member_points_once(): void
    {
        $user = User::create([
            'nama_lengkap' => 'Admin Test',
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);

        $cabang = Cabang::create([
            'nama_cabang' => 'Cabang Utama',
            'alamat' => 'Jl. Contoh',
        ]);

        $kategori = Kategori::create(['nama_kategori' => 'Test']);
        $produk = Produk::create([
            'sku' => 'TEST-001',
            'nama_barang' => 'Test Product',
            'kategori_id' => $kategori->id,
            'harga_beli' => 10000,
            'harga_eceran' => 15000,
            'harga_grosir' => 14000,
            'satuan' => 'pcs',
        ]);

        $member = Member::create([
            'id_member' => 'MBR-TEST-001',
            'nama_member' => 'Test Member',
            'no_telepon' => '081234567890',
            'email' => 'member@example.com',
            'alamat' => 'Jl. Member',
            'tipe_member' => 'reguler',
            'tier_loyalty' => 'bronze',
            'poin' => 10,
            'tanggal_bergabung' => now()->toDateString(),
            'status' => 'aktif',
        ]);

        StokCabang::create([
            'sku' => $produk->sku,
            'cabang_id' => $cabang->id,
            'stok_saat_ini' => 10,
            'minimum_stok' => 0,
        ]);

        $transaksi = Transaksi::create([
            'no_transaksi' => 'TRX-TEST-001',
            'waktu' => now(),
            'total_bayar' => 20000,
            'metode_pembayaran' => 'cash',
            'status' => 'lunas',
            'user_id' => $user->id,
            'id_member' => $member->id_member,
            'cabang_id' => $cabang->id,
            'poin_diberikan' => 2,
        ]);

        DetailTransaksi::create([
            'no_transaksi' => $transaksi->no_transaksi,
            'sku' => $produk->sku,
            'kuantitas' => 1,
            'harga_satuan' => 20000,
            'subtotal' => 20000,
        ]);

        $firstResponse = $this->actingAs($user, 'sanctum')->putJson('/api/transaksi/' . $transaksi->no_transaksi . '/batal');
        $firstResponse->assertOk();

        $member->refresh();
        $this->assertSame(8, $member->poin);
        $this->assertSame('batal', $transaksi->fresh()->status);

        $secondResponse = $this->actingAs($user, 'sanctum')->putJson('/api/transaksi/' . $transaksi->no_transaksi . '/batal');
        $secondResponse->assertStatus(422);

        $member->refresh();
        $this->assertSame(8, $member->poin);
    }
}
