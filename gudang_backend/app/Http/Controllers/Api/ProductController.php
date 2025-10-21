<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // Tambahkan search & filter jika perlu
        $query = Product::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('sku', 'like', '%' . $request->search . '%');
        }

        return $query->orderBy('name')->paginate(10);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0', // Stok awal
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    public function show(Product $product)
    {
        return $product;
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => ['required', 'string', Rule::unique('products')->ignore($product->id)],
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            // Stok tidak diupdate dari sini, tapi dari StockMovement
        ]);

        // Hanya update data master, bukan stok
        $product->update($request->only(['name', 'sku', 'category', 'description']));

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        // Opsional: Cek jika stok 0 baru boleh hapus
        if ($product->stock > 0) {
             return response()->json(['message' => 'Tidak bisa menghapus produk dengan stok > 0'], 422);
        }
        $product->delete();
        return response()->json(null, 204);
    }
}
