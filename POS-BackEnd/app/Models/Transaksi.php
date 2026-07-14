<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaksi extends Model
{
    //
    use HasFactory;

    protected $table = 'transaksi';

    protected $primaryKey = 'no_transaksi';
    protected $keyType = 'string';
    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'no_transaksi',
        'waktu',
        'total_bayar',
        'metode_pembayaran',
        'status',
        'poin_diberikan',
        'user_id',
        'id_member',
        'cabang_id',
    ];

    protected function casts(): array
    {
        return [
            'waktu' => 'datetime',
            'total_bayar' => 'decimal:2',
            'poin_diberikan' => 'integer',
        ];
    }

    public function user(): BelongsTo 
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'id_member', 'id_member');
    }

    public function cabang(): BelongsTo
    {
        return $this->belongsTo(Cabang::class, 'cabang_id');
    }

    public function detailTransaksi(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class, 'no_transaksi', 'no_transaksi');
    }
}
