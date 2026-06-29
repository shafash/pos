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
        Schema::create('member', function (Blueprint $table) {
            $table->string('id_member', 20)->primary();
            $table->string('nama_member', 100);
            $table->string('no_telepon', 20);
            $table->string('email', 100)->nullable();
            $table->string('alamat', 255)->nullable();
            $table->string('tipe_member', 50)->default('regular');
            $table->enum('tier_loyalty', ['bronze', 'silver', 'gold', 'platinum'])->default('bronze');
            $table->unsignedInteger('poin')->default(0);
            $table->date('tanggal_bergabung');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();

            $table->index('no_telepon', 'idx_member_telepon');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('member');
    }
};
