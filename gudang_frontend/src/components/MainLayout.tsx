import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HomeIcon, ArchiveBoxIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Produk', href: '/products', icon: ArchiveBoxIcon },
];

export default function MainLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="flex w-64 flex-col bg-gray-800 text-white">
                <div className="flex h-16 flex-shrink-0 items-center px-4">
                    <span className="text-xl font-semibold">Gudang App</span>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                                `group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                                    isActive
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
                {/* User info & Logout */}
                <div className="border-t border-gray-700 p-4">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <Outlet /> {/* Halaman akan dirender di sini */}
            </main>
        </div>
    );
}