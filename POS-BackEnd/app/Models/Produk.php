<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produk extends Model
{
    //
    use HasFactory;

    protected $table = 'produk';

    protected $primaryKey = 'sku';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'sku',
        'nama_barang',
        'kategori_id',
        'merek',
        'harga_beli',
        'harga_eceran',
        'harga_grosir',
        'satuan',
    ];

    protected function casts(): array
    {
        return [
            'harga_beli' => 'decimal:2',
            'harga_eceran' => 'decimal:2',
            'harga_grosir' => 'decimal:2',
        ];
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function stokCabang(): HasMany
    {
        return $this->hasMany(StokCabang::class, 'sku', 'sku');
    }

    public function detailTransaksi(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class, 'sku', 'sku');
    }

    public function detailAudit(): HasMany
    {
        return $this->hasMany(DetailAudit::class, 'sku', 'sku');
    }

    public function stokDiCabang(int $cabangId): ?stokCabang
    {
        return $this->stokCabang()->where('cabang_id', $cabangId)->first();
    }
}
