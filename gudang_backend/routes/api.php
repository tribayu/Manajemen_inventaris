<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StockMovementController;

// Rute Bawaan Breeze untuk login/register/logout sudah ada (dibuat otomatis)
// ... (biarkan rute auth bawaan)

// Rute yang terproteksi
Route::middleware(['auth:sanctum'])->group(function () {

    // Rute untuk get user yg sedang login
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // CRUD Produk
    Route::apiResource('products', ProductController::class);

    // Rute Stok
    Route::post('stock/in', [StockMovementController::class, 'stockIn']);
    Route::post('stock/out', [StockMovementController::class, 'stockOut']);
    Route::get('stock/history/{product}', [StockMovementController::class, 'history']);
    Route::get('stock/summary', [StockMovementController::class, 'summary']);
});
