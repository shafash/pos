<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cabang;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
            'email' => 'admin@rakryan.com',
            'password' => Hash::make('password123'),
            'cabang_id' => null,
        ]);

        $cabangList = Cabang::all();

        foreach ($cabangList as $cabang) {
            $nama = explode(' ', $cabang->nama_cabang);
            $slug = strtolower($nama[1] ?? $nama[0]);

            User::create([
                'nama_lengkap' => 'Kasir ' . $cabang->nama_cabang,
                'role' => 'kasir',
                'email' => "kasir.{$slug}@rakryan.com",
                'password' => 'password123',
                'cabang_id' => $cabang->id,
            ]);
        }
    }
}
