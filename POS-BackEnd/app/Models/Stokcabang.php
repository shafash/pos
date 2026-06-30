<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stokcabang extends Model
{
    //
    use HasFactory;

    protected $table = 'stok_cabang';

    protected $fillable = [
        'sku',
        'cabang_id',
        'stok_saat_ini',
        'minimum_stok',
    ];

    protected function casts(): array 
    {
        return [
            'stok_saat_ini' => 'integer',
            'minimum_stok' => 'integer',
        ];
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'sku', 'sku');
    }

    public function cabang(): BelongsTo
    {
        return $this->belongsTo(Cabang::class, 'cabang_id');
    }

    public function getPerluRestockAttribute(): bool
    {
        return $this->stok_saat_ini <= $this->minimum_stok;
    }
}
