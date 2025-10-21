<?php
namespace App\Services;

use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StockService
{
    // Fungsi untuk menambah stok
    public function addStock(Product $product, int $quantity, string $description = null, ?User $user = null): void
    {
        if ($quantity <= 0) {
            throw ValidationException::withMessages([
                'quantity' => 'Kuantitas harus lebih besar dari 0.'
            ]);
        }

        DB::transaction(function () use ($product, $quantity, $description, $user) {
            $stock_before = $product->stock;

            // 1. Update stok di produk
            $product->stock += $quantity;
            $product->save();

            // 2. Catat di log
            $product->movements()->create([
                'user_id' => $user?->id,
                'type' => 'in',
                'quantity' => $quantity,
                'stock_before' => $stock_before,
                'stock_after' => $product->stock,
                'description' => $description ?? 'Stok Masuk',
            ]);
        });
    }

    // Fungsi untuk mengurangi stok (dengan validasi)
    public function removeStock(Product $product, int $quantity, string $description = null, ?User $user = null): void
    {
        if ($quantity <= 0) {
            throw ValidationException::withMessages([
                'quantity' => 'Kuantitas harus lebih besar dari 0.'
            ]);
        }

        // Validasi stok tidak boleh negatif
        if ($product->stock < $quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Stok tidak mencukupi. Stok saat ini: ' . $product->stock,
            ]);
        }

        DB::transaction(function () use ($product, $quantity, $description, $user) {
            $stock_before = $product->stock;

            // 1. Update stok di produk
            $product->stock -= $quantity;
            $product->save();

            // 2. Catat di log
            $product->movements()->create([
                'user_id' => $user?->id,
                'type' => 'out',
                'quantity' => $quantity,
                'stock_before' => $stock_before,
                'stock_after' => $product->stock,
                'description' => $description ?? 'Stok Keluar',
            ]);
        });
    }
}
