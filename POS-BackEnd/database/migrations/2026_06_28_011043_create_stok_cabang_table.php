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
        Schema::create('stok_cabang', function (Blueprint $table) {
            $table->id();
            $table->string('sku', 30);
            $table->foreignId('cabang_id')
                ->constrained('cabang')
                ->onDelete('cascade')
                ->onUpdate('cascade');
            $table->integer('stok_saat_ini')->default(0);
            $table->integer('minimum_stok')->default(0);
            $table->timestamps();

            $table->foreign('sku')
                ->references('sku')->on('produk')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->unique(['sku', 'cabang_id'], 'uq_sku_cabang');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stok_cabang');
    }
};
