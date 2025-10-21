import type { Product } from '../types';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { PencilIcon, TrashIcon, PlusIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

// Impor modal yang baru kita buat
import ProductFormModal from '../components/ProductFormModal';
import StockMovementModal from '../components/StockMovementModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

// Tipe untuk data paginasi Laravel
interface PaginatedResponse {
    data: Product[];
    links: { [key: string]: string | null };
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk mengelola modal
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    // State untuk menyimpan produk mana yang sedang di-aksi
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Fungsi untuk fetch data
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get<PaginatedResponse>('/api/products');
            setProducts(data.data);
        } catch (error) {
            console.error('Gagal fetch produk', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- Handler untuk membuka modal ---
    
    const handleOpenAddModal = () => {
        setSelectedProduct(null); // Pastikan null (mode tambah)
        setIsProductModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setSelectedProduct(product); // Set produk (mode edit)
        setIsProductModalOpen(true);
    };

    const handleOpenStockModal = (product: Product) => {
        setSelectedProduct(product);
        setIsStockModalOpen(true);
    };

    const handleOpenDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    // --- Handler untuk Aksi Sukses (Update UI) ---

    // Fungsi ini dipanggil setelah Tambah atau Edit sukses
    const handleProductSuccess = (product: Product) => {
        if (selectedProduct) {
            // Mode Edit: Ganti produk di list
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            // Mode Tambah: Tambahkan di awal list
            setProducts([product, ...products]);
        }
    };

    // Fungsi ini dipanggil setelah Stok +/- sukses
    const handleStockSuccess = (updatedProduct: Product) => {
        // Ganti produk di list dengan data stok terbaru
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    // Fungsi ini dipanggil setelah Hapus sukses
    const handleDeleteSuccess = (deletedProductId: number) => {
        // Filter produk yg dihapus dari list
        setProducts(products.filter(p => p.id !== deletedProductId));
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
                <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700"
                >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Tambah Produk
                </button>
            </div>

            {/* Card Konten */}
            <div className="overflow-hidden rounded-lg bg-white shadow">
                {loading ? (
                    <p className="p-6">Loading data...</p>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nama</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">SKU</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Kategori</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Stok</th>
                                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.sku}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                            product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="flex justify-end gap-2 whitespace-nowrap px-6 py-4 text-sm font-medium">
                                        <button 
                                            onClick={() => handleOpenStockModal(product)}
                                            className="flex items-center rounded-md bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                                        >
                                            <AdjustmentsHorizontalIcon className="mr-1 h-4 w-4" /> Stok +/-
                                        </button>
                                        <button 
                                            onClick={() => handleOpenEditModal(product)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleOpenDeleteModal(product)}
                                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* --- Render Semua Modal di Sini --- */}
            
            <ProductFormModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSuccess={handleProductSuccess}
                productToEdit={selectedProduct} // Kirim produk jika mode edit, atau null jika mode tambah
            />

            <StockMovementModal
                isOpen={isStockModalOpen}
                onClose={() => setIsStockModalOpen(false)}
                onSuccess={handleStockSuccess}
                product={selectedProduct}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSuccess={handleDeleteSuccess}
                product={selectedProduct}
            />

        </div>
    );
}