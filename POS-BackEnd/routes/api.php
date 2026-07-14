<?php 

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\MemberController; 
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\CabangController;
use Illuminate\Support\Facades\Route;


Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/produk', [ProdukController::class, 'index']);
    Route::post('/produk', [ProdukController::class, 'store']);
    Route::get('/produk/{sku}', [ProdukController::class, 'show']);
    Route::put('/produk/{sku}', [ProdukController::class, 'update']);
    Route::delete('/produk/{sku}', [ProdukController::class, 'destroy']);
    Route::put('/produk/{sku}/stok', [ProdukController::class, 'updateStok']);
    Route::post('/produk/{sku}/foto', [ProdukController::class, 'uploadFoto']);

    Route::get('/kategori', [ProdukController::class, 'kategori']);

    Route::get('/member', [MemberController::class, 'index']);
    Route::post('/member', [MemberController::class, 'store']);
    Route::get('/member/{id}', [MemberController::class, 'show']);
    Route::put('/member/{id}', [MemberController::class, 'update']);
    Route::delete('/member/{id}', [MemberController::class, 'destroy']);

    Route::get('/transaksi', [TransaksiController::class, 'index']);
    Route::post('/transaksi', [TransaksiController::class, 'store']);
    Route::get('/transaksi/{no_transaksi}', [TransaksiController::class, 'show']);
    Route::put('/transaksi/{no_transaksi}/batal', [TransaksiController::class, 'batal']);

    Route::get('/laporan', [LaporanController::class, 'index']);
    Route::get('/cabang', [CabangController::class, 'index']);

    Route::get('/audit', [AuditController::class, 'index']);
    Route::post('/audit', [AuditController::class, 'store']);
    Route::get('/audit/{id}', [AuditController::class, 'show']);
    Route::post('/audit/{id}/detail', [AuditController::class, 'submitDetail']);
    Route::put('/audit/{id}/selesai', [AuditController::class, 'selesai']);
    Route::put('/audit/{id}/batal', [AuditController::class, 'batal']);
});