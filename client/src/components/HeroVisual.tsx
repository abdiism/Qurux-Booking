import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, MapPin, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { Role } from '../types';

interface HeroVisualProps {
    currentUser: any;
    handleMainAction: () => void;
    navigateToSalon: (id: string) => void;
    setCurrentView: (view: any) => void;
    navigateToAllServices: () => void;
}

export const HeroVisual: React.FC<HeroVisualProps> = ({ currentUser, handleMainAction, navigateToSalon, setCurrentView, navigateToAllServices }) => {
    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero Visual Card (Duna Style) */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-[320px] md:h-[500px] bg-gradient-to-br from-rose-400 via-rose-300 to-orange-200 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-rose-200/50 dark:shadow-none mb-8 md:mb-12 relative overflow-hidden group clay-card border-none"
            >
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-[2s] group-hover:scale-105" />

                {/* Glass Cards inside Hero */}
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">

                    {/* Card 1: The Booking - Hidden on very small screens or scaled down */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="hidden md:block w-64 bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl absolute left-6 bottom-12 md:left-20 md:bottom-16 clay-card !bg-white/80"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                <CheckCircle size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-stone-500 font-bold uppercase">Status</p>
                                <p className="text-sm font-bold text-stone-800">Confirmed</p>
                            </div>
                        </div>
                        <div className="h-px bg-stone-200/50 w-full mb-3" />
                        <p className="text-stone-800 font-bold text-sm">Henna & Spa Package</p>
                        <p className="text-stone-500 text-xs font-semibold">Today, 2:00 PM</p>
                    </motion.div>

                    {/* Card 2: The Salon - Adjusted for mobile */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="w-[260px] md:w-72 bg-stone-900/90 backdrop-blur-xl p-4 md:p-5 rounded-3xl shadow-2xl text-white absolute right-4 top-8 md:right-20 md:top-20 z-10 clay-card !bg-stone-900/95 !border-stone-700 scale-90 md:scale-100 origin-top-right"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                                Top Rated
                            </div>
                            <div className="flex text-orange-400">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-1 font-heading">Qurux Hablos</h3>
                        <div className="flex items-center gap-1 text-stone-400 text-xs mb-4">
                            <MapPin size={12} /> KM4, Mogadishu
                        </div>
                        <button
                            onClick={() => navigateToSalon('s1')}
                            className="w-full py-2.5 md:py-3 bg-rose-500 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors shadow-lg shadow-rose-900/50"
                        >
                            View Services
                        </button>
                    </motion.div>

                </div>
            </motion.div>

            {/* Hero Typography */}
            <div className="text-center max-w-4xl mx-auto px-4 mb-16 md:mb-24">
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl md:text-7xl font-bold text-stone-900 leading-tight tracking-tight mb-6 md:mb-8 font-heading"
                >
                    The new standard in <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">beauty & wellness.</span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-base md:text-xl text-stone-500 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
                >
                    Connect with the finest henna artists, stylists, and spas in your city.
                    Seamless booking with Zaad, EVC, and eBirr payments.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Button onClick={handleMainAction} className="!py-3 md:!py-4 !px-8 text-lg !rounded-full clay-button w-full sm:w-auto">
                        {currentUser ? (currentUser.role === Role.MANAGER ? 'Go to Dashboard' : 'Discover Salons') : 'Get Started'}
                    </Button>
                    <button onClick={navigateToAllServices} className="font-bold text-stone-600 hover:text-rose-600 transition-colors flex items-center gap-2 px-6 py-4">
                        Discover Services <ArrowRight size={18} />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
