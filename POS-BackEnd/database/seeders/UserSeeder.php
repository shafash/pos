<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cabang;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::create([
            'nama_lengkap' => 'Admin Pusat',
            'role' => 'admin',
            'email' => 'admin@elanganugerah.com',
            'password' => Hash::make('password123'),
            'cabang_id' => null,
        ]);

        $cabangList = Cabang::all();

        foreach ($cabangList as $cabang) {
            $slug = strtolower(str_replace(' ', '', explode(' ', $cabang->nama_cabang)[2] ?? 'kasir'));

            User::create([
                'nama_lengkap' => 'Kasir ' . $cabang->nama_cabang,
                'role' => 'kasir',
                'email' => "kasir.{$slug}@elanganugerah.com",
                'password' => 'password123',
                'cabang_id' => $cabang->id,
            ]);
        }
    }
}
