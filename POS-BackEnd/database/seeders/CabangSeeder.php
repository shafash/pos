<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cabang;

class CabangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $cabangList = [
            ['nama_cabang' => 'Elang Anugerah Blimbing', 'alamat' => 'Blimbing, Kota Malang'],
            ['nama_cabang' => 'Elang Anugerah Kepanjen', 'alamat' => 'Kepanjen, Kabupaten Malang'],
            ['nama_cabang' => 'Elang Anugerah Turen', 'alamat' => 'Turen, Kabupaten Malang'],
            ['nama_cabang' => 'Elang Anugerah Singosari', 'alamat' => 'Singosari, Kabupaten Malang'],
        ];

        foreach($cabangList as $cabang) {
            Cabang::create($cabang);
        }
    }
}
