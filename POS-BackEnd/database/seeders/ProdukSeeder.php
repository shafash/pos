<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kategori;
use App\Models\Produk;

class ProdukSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $kategoriBasah = Kategori::where('nama_kategori', 'Basah')->first()->id;
        $kategoriKering = Kategori::where('nama_kategori', 'Kering')->first()->id;

        $produkList = [
            ['merek' => 'Incoe', 'nama_barang' => 'Gold N50', 'kategori_id' => $kategoriBasah, 'harga_beli' => 800000, 'harga_eceran' => 1099998, 'satuan' => 'Pcs'],
            ['merek' => 'Amaron', 'nama_barang' => 'Hi-Life 55D23L', 'kategori_id' => $kategoriKering, 'harga_beli' => 1300000, 'harga_eceran' => 1600000, 'satuan' => 'Pcs'],
            ['merek' => 'Bosch', 'nama_barang' => 'MF 46B24L', 'kategori_id' => $kategoriKering, 'harga_beli' => 820000, 'harga_eceran' => 990000, 'satuan' => 'Pcs'],
            ['merek' => 'GS Astra', 'nama_barang' => 'MF NS40Z', 'kategori_id' => $kategoriKering,'harga_beli' => 740000, 'harga_eceran' => 900000, 'satuan' => 'Pcs'],
            ['merek' => 'Bosch', 'nama_barang' => 'Maintenance Free', 'kategori_id' => $kategoriKering, 'harga_beli' => 715000, 'harga_eceran' => 915000, 'satuan' => 'Pcs'],
            ['merek' => 'Motolite', 'nama_barang' => 'Gold', 'kategori_id' => $kategoriKering, 'harga_beli' => 975000, 'harga_eceran' => 1250000, 'satuan' => 'Pcs'],
            ['merek' => 'Rocket', 'nama_barang' => 'MF', 'kategori_id' => $kategoriKering, 'harga_beli' => 1025000, 'harga_eceran' => 1300000, 'satuan' => 'Pcs'],
            ['merek' => 'Delkor', 'nama_barang' => 'MF', 'kategori_id' => $kategoriKering, 'harga_beli' => 900000, 'harga_eceran' => 1800000, 'satuan' => 'Pcs'],
            ['merek' => 'G-Force', 'nama_barang' => 'N50', 'kategori_id' => $kategoriBasah, 'harga_beli' => 725000, 'harga_eceran' => 950000, 'satuan' => 'Pcs'],
            ['merek' => 'GS Astra', 'nama_barang' => 'Maintenance Free (MF)', 'kategori_id' => $kategoriKering, 'harga_beli' => 900000, 'harga_eceran' => 1000000, 'harga_grosir' => 900000, 'satuan' => 'Pcs'],
        ];

        foreach ($produkList as $produk) {
            Produk::create([
                'sku' => $this->generateSku($produk['merek']),
                'nama_barang' => $produk['merek'] . ' ' . $produk['nama_barang'],
                'kategori_id' => $produk['kategori_id'],
                'merek' => $produk['merek'],
                'harga_beli' => $produk['harga_beli'],
                'harga_eceran' => $produk['harga_eceran'],
                'harga_grosir' => $produk['harga_grosir'] ?? round($produk['harga_eceran'] * 0.9),
                'satuan' => $produk['satuan'],
            ]);
        }
    }

    private function generateSku(string $merek): string
    {
        $prefix = strtoupper(substr(str_replace(' ', '', $merek), 0, 3));
        $lastNumber = Produk::where('sku', 'like', "{$prefix}-%")->count();
        $nextNumber = str_pad((string) ($lastNumber + 1), 3, '0', STR_PAD_LEFT);

        return "{$prefix}-{$nextNumber}";
    }
}
