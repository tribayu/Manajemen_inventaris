<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\StockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    protected $stockService;

    public function __construct(StockService $stockService)
    {
        $this->stockService = $stockService;
    }

    // Endpoint untuk STOK MASUK
    public function stockIn(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string|max:255',
        ]);

        $product = Product::find($validated['product_id']);

        $this->stockService->addStock(
            $product,
            $validated['quantity'],
            $validated['description'],
            $request->user() // User yg sedang login
        );

        return response()->json(['message' => 'Stok berhasil ditambahkan', 'product' => $product->fresh()]);
    }

    // Endpoint untuk STOK KELUAR
    public function stockOut(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string|max:255',
        ]);

        $product = Product::find($validated['product_id']);

        $this->stockService->removeStock(
            $product,
            $validated['quantity'],
            $validated['description'],
            $request->user()
        );

        return response()->json(['message' => 'Stok berhasil dikurangkan', 'product' => $product->fresh()]);
    }

    // Endpoint untuk melihat RIWAYAT per produk
    public function history(Product $product)
    {
        $history = $product->movements()
                          ->with('user:id,name') // Ambil nama user
                          ->orderBy('created_at', 'desc')
                          ->paginate(15);

        return $history;
    }

    // Endpoint untuk REKAP STOK (Dashboard)
    public function summary()
    {
        $total_products = Product::count();
        $total_stock_value = Product::sum(DB::raw('stock')); // Asumsi value = quantity, bisa dikali harga
        $low_stock_products = Product::where('stock', '<', 10)->count(); // Misal low stock < 10

        return response()->json([
            'total_products' => $total_products,
            'total_stock_items' => $total_stock_value,
            'low_stock_products' => $low_stock_products,
        ]);
    }
}
