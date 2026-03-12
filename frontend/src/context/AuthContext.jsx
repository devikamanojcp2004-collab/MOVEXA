import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: check if a valid session cookie exists by calling /me
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch {
                setUser(null);  // 401 = no valid cookie, user is logged out
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Login: server sets HTTP-only cookie, we extract user from response
    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setUser(data.user);
        return data.user;
    };

    // Register: server sets HTTP-only cookie, we extract user from response
    const register = async (name, email, password, role) => {
        const { data } = await api.post('/auth/register', { name, email, password, role });
        setUser(data.user);
        return data.user;
    };

    // Logout: server clears HTTP-only cookie
    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            setUser(null);
        }
    };


    // Google OAuth: sends credential from @react-oauth/google to backend
    const googleLogin = async (credential, role = 'user') => {
        const { data } = await api.post('/auth/google', { credential, role });
        setUser(data.user);
        return data.user;
    };

    // Update local user state after profile edits
    const updateUser = (updatedData) => {
        setUser(prev => ({ ...prev, ...updatedData }));
    };

    // Re-fetch /me from server (used after OTP registration to hydrate state from the new cookie)
    const refreshUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data);
            return data;
        } catch {
            setUser(null);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, googleLogin, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
};

export default AuthContext;
