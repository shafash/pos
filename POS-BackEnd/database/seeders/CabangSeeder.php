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
            ['nama_cabang' => 'Rakryan Blimbing', 'alamat' => 'Blimbing, Kota Malang'],
            ['nama_cabang' => 'Rakryan Kepanjen', 'alamat' => 'Kepanjen, Kabupaten Malang'],
            ['nama_cabang' => 'Rakryan Turen', 'alamat' => 'Turen, Kabupaten Malang'],
            ['nama_cabang' => 'Rakryan Singosari', 'alamat' => 'Singosari, Kabupaten Malang'],
        ];

        foreach($cabangList as $cabang) {
            Cabang::create($cabang);
        }
    }
}
