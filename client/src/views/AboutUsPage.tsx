import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users, Globe, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutUsPage = () => {
    const { setCurrentView } = useApp();

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex flex-col font-sans transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 dark:bg-stone-900/80">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('LANDING')}>
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-200">
                            <Sparkles size={18} />
                        </div>
                        <span className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Qurux</span>
                    </div>
                    <button
                        onClick={() => setCurrentView('LANDING')}
                        className="flex items-center gap-2 text-stone-500 hover:text-rose-500 transition-colors font-bold text-sm"
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </button>
                </div>
            </nav>

            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-stone-800 rounded-[40px] shadow-xl overflow-hidden clay-card border-none"
                    >
                        <div className="relative h-64 md:h-80 bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center overflow-hidden shrink-0">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                            <div className="text-center relative z-10 text-white px-4">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <Sparkles size={40} />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">About Qurux</h1>
                                <p className="text-white/90 font-medium text-lg">Beauty for everyone.</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <div className="space-y-12">
                                <section>
                                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">Our Mission</h2>
                                    <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
                                        Qurux is Somalia's premier beauty booking platform, dedicated to connecting clients with the best salons, spas, and henna artists in their city. We believe that self-care should be accessible, convenient, and delightful. Our mission is to empower local beauty businesses with technology while providing customers with a seamless booking experience.
                                    </p>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-3xl text-center">
                                        <Heart size={32} className="text-rose-500 mx-auto mb-3" />
                                        <h4 className="font-bold text-stone-900 dark:text-white text-lg">Passion</h4>
                                        <p className="text-stone-500 dark:text-stone-400 mt-1">We love what we do.</p>
                                    </div>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl text-center">
                                        <Users size={32} className="text-blue-500 mx-auto mb-3" />
                                        <h4 className="font-bold text-stone-900 dark:text-white text-lg">Community</h4>
                                        <p className="text-stone-500 dark:text-stone-400 mt-1">Building connections.</p>
                                    </div>
                                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-3xl text-center">
                                        <Globe size={32} className="text-orange-500 mx-auto mb-3" />
                                        <h4 className="font-bold text-stone-900 dark:text-white text-lg">Local</h4>
                                        <p className="text-stone-500 dark:text-stone-400 mt-1">Made in Somalia.</p>
                                    </div>
                                </div>

                                <section>
                                    <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">The Story</h2>
                                    <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
                                        Founded in 2024, Qurux started with a simple observation: finding and booking a salon appointment was harder than it should be. We set out to change that by building a platform that puts the user first. Today, we are proud to partner with hundreds of beauty professionals across the region.
                                    </p>
                                </section>

                                <div className="bg-stone-900 dark:bg-black text-stone-400 p-8 rounded-3xl text-center">
                                    <p className="text-lg font-medium mb-6 text-white">Want to join our team or partner with us?</p>
                                    <button className="bg-white text-stone-900 px-8 py-3 rounded-xl font-bold hover:bg-stone-200 transition-colors">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};
