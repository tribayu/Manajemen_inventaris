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
       Schema::create('stock_movements', function (Blueprint $table) {
        $table->id();
        $table->foreignId('product_id')->constrained()->onDelete('cascade');
        $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null'); // Siapa yg melakukan
        $table->enum('type', ['in', 'out']); // Jenis pergerakan
        $table->integer('quantity'); // Jumlah yg masuk/keluar
        $table->integer('stock_before'); // Stok sebelum transaksi
        $table->integer('stock_after'); // Stok setelah transaksi
        $table->string('description')->nullable(); // Catatan (misal: "Stok opname", "Retur")
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
