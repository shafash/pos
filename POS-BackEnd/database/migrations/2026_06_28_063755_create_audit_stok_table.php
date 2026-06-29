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
        Schema::create('audit_stok', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabang_id')
                ->constrained('cabang')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            $table->dateTime('tanggal_audit')->useCurrent();
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            $table->enum('status', ['berlangsung', 'selesai', 'dibatalkan'])->default('berlangsung');
            $table->string('catatan', 255)->nullable();
            $table->index('cabang_id', 'idx_auditstok_cabang');
            $table->index('tanggal_audit', 'idx_auditstok_tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_stok');
    }
};
