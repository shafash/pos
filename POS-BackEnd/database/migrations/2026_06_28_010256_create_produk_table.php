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
        Schema::create('produk', function (Blueprint $table) {
            $table->string('sku', 30)->primary();
            $table->string('nama_barang', 150);
            $table->foreignId('kategori_id')
                ->constrained('kategori')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            $table->string('merek', 100)->nullable();
            $table->decimal('harga_beli', 12, 2)->default(0);
            $table->decimal('harga_eceran', 12, 2)->default(0);
            $table->decimal('harga_grosir', 12, 2)->default(0);
            $table->string('satuan', 20)->default('pcs');
            $table->timestamps();

            $table->index('nama_barang', 'idx_produk_nama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
