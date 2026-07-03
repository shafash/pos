<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cabang;
use App\Models\Produk;
use App\Models\StokCabang;

class StokCabangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $cabangList = Cabang::all();
        $produkList = Produk::all();

        $stokAcuan = [
            'Incoe Gold N50' => 15,
            'GS Astra MF NS40Z' => 9,
            'Amaron Hi-Life 55D23L' => 24,
            'Bosch MF 46B24L' => 5,
        ];

        $cabangKepanjen = $cabangList->firstWhere('nama_cabang', 'Elang Anugerah Kepanjen');

        foreach ($produkList as $produk) {
            foreach ($cabangList as $cabang) {
                $stokDasar = $stokAcuan[$produk->nama_barang] ?? 12;
                $stokSaatIni = max(0, $stokDasar - ($cabang->id - 1) * 2);
                StokCabang::create([
                    'sku' => $produk->sku,
                    'cabang_id' => $cabang->id,
                    'stok_saat_ini' => $stokSaatIni,
                    'minimum_stok' => 5,
                ]);
            }
        }

        $produkKritis = Produk::where('nama_barang', 'like', 'GS Astra MF NS40Z')->first();

        if ($produkKritis && $cabangKepanjen) {
            StokCabang::where('sku', $produkKritis->sku)
                ->where('cabang_id', $cabangKepanjen->id)
                ->update(['stok_saat_ini' => 1, 'minimum_stok' => 5]);
        }
    }
}
