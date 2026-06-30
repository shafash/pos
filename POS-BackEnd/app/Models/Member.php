<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Member extends Model
{
    //
    use HasFactory;

    protected $table = 'member';

    protected $primaryKey = 'id_member';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id_member',
        'nama_member',
        'no_telepon', 
        'email', 
        'alamat',
        'tipe_member',
        'tier_loyalty',
        'poin',
        'tanggal_bergabung',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_bergabung' => 'date',
            'poin' => 'integer',
        ];
    }

    public function transaksi(): HasMany
    {
        return $this->hasMany(Transaksi::class, 'id_member', 'id_member');
    }
}
