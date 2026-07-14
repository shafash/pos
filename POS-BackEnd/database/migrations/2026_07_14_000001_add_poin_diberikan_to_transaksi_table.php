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
        if (! Schema::hasColumn('transaksi', 'poin_diberikan')) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->unsignedInteger('poin_diberikan')->default(0)->after('status');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('transaksi', 'poin_diberikan')) {
            Schema::table('transaksi', function (Blueprint $table) {
                $table->dropColumn('poin_diberikan');
            });
        }
    }
};
