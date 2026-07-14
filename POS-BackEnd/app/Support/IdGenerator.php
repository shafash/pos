<?php

namespace App\Support;

use Illuminate\Support\Str;

class IdGenerator
{
    public function memberId(): string
    {
        return 'MBR-' . strtoupper(substr((string) Str::ulid(), 0, 8));
    }

    public function transaksiNo(): string
    {
        $tanggal = now()->format('Ymd');

        return "TRX-{$tanggal}-" . (string) Str::ulid();
    }

    public function produkSku(string $merek): string
    {
        $prefix = strtoupper(substr(str_replace(' ', '', $merek), 0, 3));

        return "{$prefix}-" . (string) Str::ulid();
    }
}
