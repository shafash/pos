<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Member;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $memberList = [
            ['id_member' => 'MBR-0021', 'nama_member' => 'Keizuro Isaac', 'no_telepon' => '0812-3456-7890', 'alamat' => 'Jl. Suropati No.157, Singosari, Kabupaten Malang', 'poin' => 8500],
            ['id_member' => 'MBR-0020', 'nama_member' => 'Jiwa Trisna Kama', 'no_telepon' => '0813-7788-9922', 'alamat' => 'Jl. Jendral Ahmad Yani Utara No.32', 'poin' => 4100],
            ['id_member' => 'MBR-0019', 'nama_member' => 'Adimas Ken Maharu', 'no_telepon' => '0821-5566-1100', 'alamat' => 'Komplek Araya Business Center', 'poin' => 900],
            ['id_member' => 'MBR-0018', 'nama_member' => 'Kandra Hamirga', 'no_telepon' => '0822-9090-1234', 'alamat' => 'Jl. Simpang Borobudur No.7', 'poin' => 2670],
            ['id_member' => 'MBR-0017', 'nama_member' => 'Geivano Eldanar', 'no_telepon' => '0856-4444-7777', 'alamat' => 'Jl. Stadion Utara No.02 RT.01 RW.15', 'poin' => 7000],
            ['id_member' => 'MBR-0016', 'nama_member' => 'Galva Giltantama', 'no_telepon' => '0857-3210-8888', 'alamat' => 'Jl. Sidodadi No.20 RT 01 RW 08, Singosari', 'poin' => 3907],
            ['id_member' => 'MBR-0015', 'nama_member' => 'Kael Hiro', 'no_telepon' => '0877-6655-4433', 'alamat' => 'Jl. Ahmad Yani No.15, Kepanjen', 'poin' => 1798],
            ['id_member' => 'MBR-0014', 'nama_member' => 'Milano Keshi', 'no_telepon' => '0881-7000-1122', 'alamat' => 'Jl. KH. Ahmad Dahlan, Kepanjen', 'poin' => 6561],
            ['id_member' => 'MBR-0013', 'nama_member' => 'Baraja Gefardian', 'no_telepon' => '0895-1234-5678', 'alamat' => 'Jl. Sulfat No.74, Purwantoro', 'poin' => 9718],
        ];

        foreach ($memberList as $member) {
            Member::create([
                'id_member' => $member['id_member'],
                'nama_member' => $member['nama_member'],
                'no_telepon' => $member['no_telepon'],
                'email' => null,
                'alamat' => $member['alamat'],
                'tipe_member' => 'reguler',
                'poin' => $member['poin'],
                'tanggal_bergabung' => '2025-01-01',
                'status' => 'aktif',
            ]);
        }
    }

    private function tentukanTier(int $poin): string
    {
        if ($poin >= 7000) {
            return 'gold';
        }
        if ($poin >= 3000) {
            return 'silver';
        }
            return 'bronze';
    }
}
