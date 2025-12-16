import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, User, ArrowRight, Phone, Mail, Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (name: string, phone?: string) => void;
    title?: string;
    defaultRole?: 'CUSTOMER' | 'MANAGER';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, title = "Join Qurux", defaultRole = 'CUSTOMER' }) => {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Auth State
    const [isRegister, setIsRegister] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isRegister) {
                // Sign Up
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            phone_number: phone,
                            role: defaultRole
                        }
                    }
                });

                if (error) throw error;

                // Check if session is established immediately (verified) or not (needs verification)
                if (data.session) {
                    showToast('Account created successfully!', 'success');
                    onClose();
                } else {
                    // Start Verification Flow
                    setIsVerifying(true);
                    showToast('Verification code sent to your email.', 'success');
                }
            } else {
                // Login
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (error) throw error;
                showToast('Welcome back!', 'success');
                onClose();
            }
        } catch (error: any) {
            console.error('Auth Error:', error);
            showToast(error.message || 'Authentication failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup'
                // Or 'email' depending on Supabase version, usually 'signup' for registration verification
            });

            if (error) throw error;

            showToast('Email verified! You are now logged in.', 'success');
            onClose();
        } catch (error: any) {
            console.error('Verification Error:', error);
            showToast(error.message || 'Invalid code', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md clay-card rounded-[32px] p-6 sm:p-8 overflow-hidden bg-white max-h-[90vh] overflow-y-auto"
            >
                {/* Decor */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50 pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="mb-6 sm:mb-8 relative z-10">
                    <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-4 shadow-inner">
                        {isVerifying ? <CheckCircle size={28} /> : <Sparkles size={28} />}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
                        {isVerifying ? "Verify Email" : (title === "Create Account" && !isRegister ? "Welcome Back" : title)}
                    </h2>
                    <p className="text-stone-500 font-medium text-sm sm:text-base">
                        {isVerifying
                            ? `Enter the code sent to ${email}`
                            : (isRegister
                                ? (defaultRole === 'MANAGER'
                                    ? "Sign up to manage your bookings, finances, and grow your business."
                                    : "Create an account to book your glow up.")
                                : "Welcome back, beautiful!")}
                    </p>
                </div>

                {isVerifying ? (
                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">Verification Code</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="e.g. 123456"
                                    maxLength={10}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900 placeholder:text-stone-300 tracking-widest text-lg"
                                />
                            </div>
                        </div>
                        <Button fullWidth onClick={handleVerify} disabled={loading || otp.length < 6} className="mt-4 clay-button">
                            {loading ? <Loader2 className="animate-spin" /> : 'Verify & Log In'}
                            {!loading && <ArrowRight size={18} />}
                        </Button>
                        <button
                            onClick={() => setIsVerifying(false)}
                            className="w-full text-center text-sm text-stone-400 hover:text-stone-600 mt-4"
                        >
                            Back to Sign Up
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 relative z-10">
                        {isRegister && (
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">
                                    {defaultRole === 'MANAGER' ? 'Owner Name' : 'Full Name'}
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={defaultRole === 'MANAGER' ? "e.g. Mohamed Ali" : "e.g. Sahra Ahmed"}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900 placeholder:text-stone-300"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. sahra@example.com"
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900 placeholder:text-stone-300"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900 placeholder:text-stone-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {isRegister && (
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">Phone Number <span className="text-rose-500">*</span></label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. 61 XXX XXXX"
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900 placeholder:text-stone-300"
                                    />
                                </div>
                            </div>
                        )}

                        <Button fullWidth onClick={handleSubmit} disabled={loading || !email || !password || (isRegister && (!phone || !name))} className="mt-4 clay-button">
                            {loading ? <Loader2 className="animate-spin" /> : (isRegister ? 'Create Account' : 'Log In')}
                            {!loading && <ArrowRight size={18} />}
                        </Button>
                    </div>
                )}

                {!isVerifying && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={async () => {
                                if (!navigator.onLine) {
                                    showToast('No internet connection. Please connect to Wi-Fi or Data.', 'error');
                                    return;
                                }
                                const toastId = showToast('Checking server connection...', 'info');
                                try {
                                    const start = Date.now();
                                    const { error } = await supabase.from('salons').select('count', { count: 'exact', head: true });
                                    const duration = Date.now() - start;
                                    if (error) throw error;
                                    showToast(`Your internet is good! Server connected (${duration}ms).`, 'success');
                                } catch (e: any) {
                                    showToast(`Internet is good, but Server is unreachable: ${e.message}`, 'error');
                                }
                            }}
                            className="text-xs text-stone-400 underline hover:text-stone-600 mb-2 block"
                        >
                            Check Internet Connection
                        </button>
                    </div>
                )}

                {!isVerifying && (
                    <div className="mt-2 text-center relative z-10">
                        <p className="text-sm text-stone-500">
                            {isRegister ? "Already have an account?" : "New here?"} {' '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-rose-600 font-bold hover:underline"
                            >
                                {isRegister ? "Log in" : "Sign up"}
                            </button>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};