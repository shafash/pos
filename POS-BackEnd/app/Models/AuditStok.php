<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AuditStok extends Model
{
    //
    use HasFactory;

    protected $table = 'audit_stok';

    public $timestamps = false;

    protected $fillable = [
        'cabang_id',
        'tanggal_audit',
        'user_id',
        'status',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_audit' => 'datetime',
        ];
    }

    public function cabang(): BelongsTo
    {
        return $this->belongsTo(Cabang::class, 'cabang_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function detailAudit(): HasMany
    {
        return $this->hasMany(DetailAudit::class, 'audit_id');
    }
}
