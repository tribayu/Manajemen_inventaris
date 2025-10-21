import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

// Layouts & Pages
import ProtectedRoute from './components/ProtectedRoute'; // <-- 1. Pastikan ini di-impor
import MainLayout from './components/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductPage from './pages/ProductPage';

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: <ProtectedRoute />, // <-- 2. Set penjaga di sini
        children: [
            {
                element: <MainLayout />, // <-- 3. Pindahkan MainLayout ke dalam 'children'
                children: [
                    { path: '/', element: <DashboardPage /> },
                    { path: '/products', element: <ProductPage /> },
                    // Tambahkan rute lain di sini
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>
);