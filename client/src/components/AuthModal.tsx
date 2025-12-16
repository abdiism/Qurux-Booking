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
                // Sign Up Logic
                // If email is empty, generate a dummy one from phone
                let registerEmail = email;
                if (!registerEmail || registerEmail.trim() === '') {
                    // Clean phone number: remove non-numeric chars
                    const cleanPhone = phone.replace(/\D/g, '');
                    registerEmail = `${cleanPhone}@no-email.qurux.app`;
                }

                const { data, error } = await supabase.auth.signUp({
                    email: registerEmail,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            phone_number: phone,
                            role: defaultRole,
                            is_dummy_email: !email // Flag to know if they provided a real email
                        }
                    }
                });

                if (error) throw error;

                if (data.session) {
                    showToast('Account created successfully!', 'success');
                    onLogin(name, phone); // Trigger parent update
                    onClose();
                } else {
                    // This happens if email confirmation is on. 
                    // Since we control dummy emails, they can't verify. 
                    // Ideally, disable email confirmation in Supabase for this to work perfectly, 
                    // OR use the 'Auto Confirm' setting in Supabase.
                    // For now, we assume dummy emails might get stuck if verify is required.
                    if (registerEmail.endsWith('@no-email.qurux.app')) {
                        showToast('Account created! Please log in.', 'success');
                        setIsRegister(false); // Switch to login view
                    } else {
                        setIsVerifying(true);
                        showToast('Verification code sent to your email.', 'success');
                    }
                }
            } else {
                // Login Logic
                let loginEmail = email;

                // Check if user entered a phone number (digits only, or starting with +)
                // Simple regex: contains only digits, +, -, whitespace
                const isPhoneNumber = /^[0-9+\-\s]+$/.test(email) && !email.includes('@');

                if (isPhoneNumber) {
                    const cleanPhone = email.replace(/\D/g, '');
                    loginEmail = `${cleanPhone}@no-email.qurux.app`;
                }

                const { data: loginData, error } = await supabase.auth.signInWithPassword({
                    email: loginEmail,
                    password
                });
                if (error) throw error;

                // Fetch user name if not provided
                const userName = loginData.user?.user_metadata?.full_name || name || 'User';

                showToast('Welcome back!', 'success');
                onLogin(userName, phone); // Trigger parent update
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
                            <label className="block text-xs font-bold text-stone-500 uppercase mb-2 ml-1">
                                {isRegister ? "Email (Optional)" : "Email or Phone Number"}
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={isRegister ? "e.g. sahra@example.com" : "Email or Phone (e.g. 615XXX)"}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900 placeholder:text-stone-300"
                                />
                            </div>
                            {isRegister && <p className="text-[10px] text-stone-400 mt-1 ml-1">We use this for booking receipts. You can leave it empty.</p>}
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

                        <Button fullWidth onClick={handleSubmit} disabled={loading || (isRegister ? (!password || !phone || !name) : (!email || !password))} className="mt-4 clay-button">
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