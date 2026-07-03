<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\HasMany;

class Cabang extends Model
{
    //
    use HasFactory;

    protected $table = 'cabang';

    protected $fillable = [
        'nama_cabang',
        'alamat',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'cabang_id');
    }

    public function stokCabang(): HasMany
    {
        return $this->hasMany(StokCabang::class, 'cabang_id');
    }

    public function transaksi(): HasMany 
    {
        return $this->hasMany(Transaski::class, 'cabang_id');
    }

    public function auditStok(): HasMany
    {
        return $this->hasMany(AuditStok::class, 'cabang_id');
    }
}
