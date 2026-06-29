<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_audit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('audit_id')
                ->constrained('audit_stok')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->string('sku', 30);
            $table->foreignId('cabang_id')
                ->constrained('cabang')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            $table->integer('stok_sistem');
            $table->integer('stok_fisik');
            $table->integer('selisih');
            $table->string('alasan', 255)->nullable();

            $table->foreign('sku')
                ->references('sku')->on('produk')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            $table->index('audit_id', 'idx_detailaudit_audit');
            $table->index('sku', 'idx_detailaudit_sku');
            $table->index('cabang_id', 'idx_detailaudit_cabang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_audit');
    }
};
