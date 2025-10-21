<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true), // misal: "Kursi Kantor Ergonomis"
            'sku' => fake()->unique()->bothify('SKU-###???'), // misal: "SKU-123ABC"
            'category' => fake()->randomElement(['Elektronik', 'Aksesoris', 'Perabotan', 'Buku']),
            'description' => fake()->paragraph(),
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
}
