import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Users, Globe } from 'lucide-react';

interface AboutUsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
                >
                    <div className="relative h-48 bg-gradient-to-br from-rose-400 to-orange-300 flex items-center justify-center overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                        <div className="text-center relative z-10 text-white">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Sparkles size={32} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight">Qurux</h2>
                            <p className="text-white/90 font-medium">Beauty for everyone.</p>
                        </div>
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-md">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-stone-900 mb-3">Our Mission</h3>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    Qurux is Somalia's premier beauty booking platform, dedicated to connecting clients with the best salons, spas, and henna artists in their city. We believe that self-care should be accessible, convenient, and delightful. Our mission is to empower local beauty businesses with technology while providing customers with a seamless booking experience.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-rose-50 p-4 rounded-2xl text-center">
                                    <Heart size={24} className="text-rose-500 mx-auto mb-2" />
                                    <h4 className="font-bold text-stone-900 text-sm">Passion</h4>
                                    <p className="text-xs text-stone-500 mt-1">We love what we do.</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-2xl text-center">
                                    <Users size={24} className="text-blue-500 mx-auto mb-2" />
                                    <h4 className="font-bold text-stone-900 text-sm">Community</h4>
                                    <p className="text-xs text-stone-500 mt-1">Building connections.</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-2xl text-center">
                                    <Globe size={24} className="text-orange-500 mx-auto mb-2" />
                                    <h4 className="font-bold text-stone-900 text-sm">Local</h4>
                                    <p className="text-xs text-stone-500 mt-1">Made in Somalia.</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-stone-900 mb-3">The Story</h3>
                                <p className="text-stone-600 text-sm leading-relaxed">
                                    Founded in 2024, Qurux started with a simple observation: finding and booking a salon appointment was harder than it should be. We set out to change that by building a platform that puts the user first. Today, we are proud to partner with hundreds of beauty professionals across the region.
                                </p>
                            </div>

                            <div className="bg-stone-900 text-stone-400 p-6 rounded-2xl text-center">
                                <p className="text-sm font-medium mb-4">Want to join our team or partner with us?</p>
                                <button className="bg-white text-stone-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-stone-200 transition-colors">
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
