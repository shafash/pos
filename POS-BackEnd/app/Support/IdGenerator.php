<?php

namespace App\Support;

use App\Models\Pengaturan;
use Illuminate\Support\Str;

class IdGenerator
{
    public function memberId(): string
    {
        return 'MBR-' . strtoupper(substr((string) Str::ulid(), 0, 8));
    }

    public function transaksiNo(): string
    {
        $prefix  = Pengaturan::get('invoice_prefix', 'TRX-');
        $tanggal = now()->format('Ymd');

        return $prefix . $tanggal . '-' . strtoupper(substr((string) Str::ulid(), 0, 8));
    }

    public function produkSku(string $merek): string
    {
        $prefix = strtoupper(substr(str_replace(' ', '', $merek), 0, 3));

        return "{$prefix}-" . (string) Str::ulid();
    }
}