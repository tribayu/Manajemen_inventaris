import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api, { getCsrfCookie } from '../lib/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cek user saat aplikasi load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await api.get('/api/user');
                setUser(data);
            } catch (error) {
                console.error('Not authenticated');
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        await getCsrfCookie(); // Ambil CSRF dulu
        await api.post('/login', credentials);
        const { data } = await api.get('/api/user'); // Ambil data user
        setUser(data);
        setIsLoading(false);
    };

    const logout = async () => {
        setIsLoading(true);
        await api.post('/logout');
        setUser(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};