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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->string('no_transaksi', 30)->primary();
            $table->dateTime('waktu')->useCurrent();
            $table->decimal('total_bayar', 14, 2)->default(0);
            $table->enum('metode_pembayaran', ['cash', 'debit', 'kredit', 'qris', 'transfer'])->default('cash');
            $table->enum('status', ['lunas', 'pending', 'batal'])->default('lunas');
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            $table->string('id_member', 20)->nullable();
            $table->foreignId('cabang_id')
                ->constrained('cabang')
                ->onDelete('restrict')
                ->onUpdate('cascade');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('id_member')
                ->references('id_member')->on('member')
                ->onDelete('set null')
                ->onUpdate('cascade');

            $table->index('waktu', 'idx_transaksi_waktu');
            $table->index('cabang_id', 'idx_transaksi_cabang');
            $table->index('id_member', 'idx_transaksi_member');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
