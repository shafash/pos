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
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->id();
            $table->string('no_transaksi', 30);
            $table->string('sku', 30);
            $table->unsignedInteger('kuantitas')->default(1);
            $table->decimal('harga_satuan', 12, 2);
            $table->decimal('subtotal', 14, 2);

            $table->foreign('no_transaksi')
                ->references('no_transaksi')->on('transaksi')
                ->onDelete('cascade')
                ->onUpdate('cascade');

            $table->foreign('sku')
                ->references('sku')->on('produk')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            $table->index('no_transaksi', 'idx_detiltransaksi_notransaksi');
            $table->index('sku', 'idx_detailtransaksi_sku');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
