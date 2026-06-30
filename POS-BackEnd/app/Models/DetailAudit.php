<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailAudit extends Model
{
    //
    use HasFactory;

    protected $table = 'detail_audit';

    public $timestamps = false;

    protected $fillable = [
        'audit_id',
        'sku', 
        'cabang_id',
        'stok_sistem',
        'stok_fisik', 
        'selisih',
        'alasan',
    ];

    protected function casts(): array
    {
        return [
            'stok_sistem' => 'integer',
            'stok_fisik' => 'integer',
            'selisih' => 'integer',
        ];
    }

    public function auditStok(): BelongsTo
    {
        return $this->belongsTo(AuditStok::class, 'audit_id');
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class, 'sku', 'sku');
    }

    public function cabang(): BelongsTo
    {
        return $this->belongsTo(Cabang::class, 'cabang_id');
    }
}
