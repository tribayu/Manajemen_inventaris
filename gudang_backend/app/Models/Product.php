<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'sku', 'category', 'description', 'stock'];

    // Relasi ke log pergerakan stok
    public function movements()
    {
        return $this->hasMany(StockMovement::class);
    }
}
