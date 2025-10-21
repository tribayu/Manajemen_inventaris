import { Fragment, useState, useEffect} from 'react';
import type { FormEvent } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../lib/api';

interface Product {
    id: number;
    name: string;
    sku: string;
    category: string;
    stock: number;
    description: string;
}

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (product: Product) => void;
    productToEdit?: Product | null;
}

// Tipe untuk menampung error validasi dari Laravel
interface ValidationErrors {
    [key: string]: string[];
}

export default function ProductFormModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    productToEdit 
}: ProductFormModalProps) {
    const [name, setName] = useState('');
    const [sku, setSku] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const isEditMode = !!productToEdit;

    // Isi form jika ini adalah mode edit
    useEffect(() => {
        if (isEditMode && productToEdit) {
            setName(productToEdit.name);
            setSku(productToEdit.sku);
            setCategory(productToEdit.category || '');
            setStock(productToEdit.stock);
            setDescription(productToEdit.description || '');
        } else {
            // Reset form jika mode tambah
            setName('');
            setSku('');
            setCategory('');
            setStock(0);
            setDescription('');
        }
        setErrors({}); // Selalu reset error saat modal dibuka/diganti
    }, [isOpen, productToEdit, isEditMode]);
    
    // Helper untuk menampilkan error
    const getError = (field: string) => {
        return errors[field] ? <span className="text-xs text-red-600">{errors[field][0]}</span> : null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const payload = { name, sku, category, description, stock };

        try {
            let response;
            if (isEditMode) {
                // Mode EDIT (PUT)
                // Kita tidak mengizinkan edit stok dari sini
                const updatePayload = { name, sku, category, description };
                response = await api.put(`/api/products/${productToEdit!.id}`, updatePayload);
            } else {
                // Mode TAMBAH (POST)
                response = await api.post('/api/products', payload);
            }
            
            onSuccess(response.data); // Kirim produk baru/update ke parent
            onClose(); // Tutup modal
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                // Tangani error validasi dari Laravel
                setErrors(err.response.data.errors);
            } else {
                console.error('Terjadi kesalahan:', err);
                // Set error umum jika perlu
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
                                </Dialog.Title>
                                
                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {getError('name')}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                                        <input
                                            type="text"
                                            value={sku}
                                            onChange={(e) => setSku(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {getError('sku')}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                        <input
                                            type="text"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {getError('category')}
                                    </div>
                                    
                                    {/* Hanya tampilkan input stok saat mode Tambah */}
                                    {!isEditMode && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Stok Awal</label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) => setStock(parseInt(e.target.value))}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                            />
                                            {getError('stock')}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {getError('description')}
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            onClick={onClose}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {isLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambah Produk')}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}