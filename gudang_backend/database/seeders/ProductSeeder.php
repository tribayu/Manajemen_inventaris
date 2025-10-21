<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat 1 User Admin
        User::factory()->create([
             'name' => 'Admin ',
             'email' => 'admin123@gudang.com',
             'password' => bcrypt('password'), // password
        ]);

        // 2. Buat Produk Dummy
        Product::factory()->create([
            'name' => 'Laptop Pro 14"',
            'sku' => 'LP14-001',
            'category' => 'Elektronik',
            'stock' => 15,
        ]);

        Product::factory()->create([
            'name' => 'Mouse Wireless',
            'sku' => 'MS-W002',
            'category' => 'Aksesoris',
            'stock' => 50,
        ]);

        Product::factory(10)->create(); // Buat 10 lagi random
    }
}
