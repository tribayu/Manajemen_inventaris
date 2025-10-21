import { Fragment, useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import api from '../lib/api';
import type { Product } from '../types';



interface StockMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedProduct: Product) => void;
    product: Product | null;
}

interface ValidationErrors {
    [key: string]: string[];
}

export default function StockMovementModal({ isOpen, onClose, onSuccess, product }: StockMovementModalProps) {
    const [type, setType] = useState<'in' | 'out'>('in');
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    // Reset form setiap modal dibuka
    useEffect(() => {
        if (isOpen) {
            setType('in');
            setQuantity(1);
            setDescription('');
            setErrors({});
        }
    }, [isOpen]);

    const getError = (field: string) => {
        return errors[field] ? <span className="text-xs text-red-600">{errors[field][0]}</span> : null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!product) return;
        
        setIsLoading(true);
        setErrors({});

        const endpoint = type === 'in' ? '/api/stock/in' : '/api/stock/out';
        const payload = {
            product_id: product.id,
            quantity: quantity,
            description: description,
        };

        try {
            const response = await api.post(endpoint, payload);
            onSuccess(response.data.product); // Kirim data produk yg sudah terupdate
            onClose();
        } catch (err: any) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                console.error('Terjadi kesalahan:', err);
                // Set error umum jika quantity tidak cukup, dll.
                setErrors({ quantity: [err.response?.data?.message || 'Terjadi kesalahan'] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                {/* ... Backdrop (bisa copy dari ProductFormModal) ... */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Atur Stok: <span className="font-bold">{product?.name}</span>
                                </Dialog.Title>
                                <p className="text-sm text-gray-500">Stok Saat Ini: {product?.stock}</p>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <RadioGroup value={type} onChange={setType}>
                                        <RadioGroup.Label className="block text-sm font-medium text-gray-700">Tipe Transaksi</RadioGroup.Label>
                                        <div className="mt-1 grid grid-cols-2 gap-4">
                                            <RadioGroup.Option value="in" className={({ checked }) => `${checked ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} cursor-pointer rounded-md border border-gray-300 p-3 text-center`}>
                                                Stok Masuk
                                            </RadioGroup.Option>
                                            <RadioGroup.Option value="out" className={({ checked }) => `${checked ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900'} cursor-pointer rounded-md border border-gray-300 p-3 text-center`}>
                                                Stok Keluar
                                            </RadioGroup.Option>
                                        </div>
                                    </RadioGroup>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kuantitas</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {getError('quantity')}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                                        <input
                                            type="text"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder={type === 'in' ? 'Mis: Barang dari supplier' : 'Mis: Penjualan customer'}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                        />
                                        {getError('description')}
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <button type="button" className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose}>
                                            Batal
                                        </button>
                                        <button type="submit" disabled={isLoading} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                                            {isLoading ? 'Memproses...' : 'Simpan Stok'}
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