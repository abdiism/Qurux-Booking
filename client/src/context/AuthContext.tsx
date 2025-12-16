import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User, Role } from '../types';
import { profileService } from '../services/profileService';

interface AuthContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    login: (role: Role, name: string) => void;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; onRoleRedirect: (role: Role) => void }> = ({ children, onRoleRedirect }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Auth State Listener
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                try {
                    let user: User | null = null;
                    const profile = await profileService.getProfile(session.user.id);

                    if (profile) {
                        user = {
                            id: session.user.id,
                            name: profile.full_name || session.user.email?.split('@')[0] || 'User',
                            email: session.user.email || '',
                            role: profile.role as Role,
                            phoneNumber: profile.phone_number
                        };
                    } else {
                        // Fallback to session metadata if profile is missing
                        console.warn('Profile not found, falling back to session metadata');
                        const metadata = session.user.user_metadata;
                        user = {
                            id: session.user.id,
                            name: metadata.full_name || session.user.email?.split('@')[0] || 'User',
                            email: session.user.email || '',
                            role: (metadata.role as Role) || Role.CUSTOMER,
                            phoneNumber: metadata.phone_number
                        };
                    }

                    if (user) {
                        setCurrentUser(user);
                        onRoleRedirect(user.role);
                    }
                } catch (error: any) {
                    console.error('Error in auth listener:', error);
                    // Fallback to session metadata if profile fetch fails (e.g. network error)
                    const metadata = session.user.user_metadata;
                    const user: User = {
                        id: session.user.id,
                        name: metadata.full_name || session.user.email?.split('@')[0] || 'User',
                        email: session.user.email || '',
                        role: (metadata.role as Role) || Role.CUSTOMER,
                        phoneNumber: metadata.phone_number
                    };
                    setCurrentUser(user);
                    onRoleRedirect(user.role);

                    // Notify user if it was a fetch error
                    if (error.message && error.message.includes('fetch')) {
                        // We can't use useToast here easily because AuthProvider wraps ToastProvider usually? 
                        // Actually App.tsx structure matters. If ToastProvider is inside AuthProvider, we can't use it.
                        // Assuming ToastProvider is OUTSIDE AuthProvider or we just log it.
                        // Let's just log for now, the fallback will allow login to proceed.
                        console.warn('Network error fetching profile, using session fallback.');
                    }
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [onRoleRedirect]);

    const login = async (role: Role, name: string) => {
        console.warn('Use supabase.auth.signInWithPassword instead of login()');
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
