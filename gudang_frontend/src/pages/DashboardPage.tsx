import { useEffect, useState } from 'react';
import api from '../lib/api';

interface Summary {
    total_products: number;
    total_stock_items: number;
    low_stock_products: number;
}

export default function DashboardPage() {
    const [summary, setSummary] = useState<Summary | null>(null);

    useEffect(() => {
        api.get('/api/stock/summary').then(res => setSummary(res.data));
    }, []);

    if (!summary) return <p>Loading dashboard...</p>;

    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Card 1 */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-sm font-medium text-gray-500">Total Produk</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.total_products}</p>
                </div>
                {/* Card 2 */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-sm font-medium text-gray-500">Total Item Stok</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{summary.total_stock_items}</p>
                </div>
                {/* Card 3 */}
                <div className="rounded-lg bg-white p-6 shadow"> <p className="text-sm font-medium text-gray-500">Produk Stok Menipis</p> <p className="mt-1 text-3xl font-semibold text-red-600">{summary.low_stock_products}</p> </div> </div> </div> ); }
                