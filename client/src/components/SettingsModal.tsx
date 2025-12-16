import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Globe, Moon, Shield, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { showToast } = useToast();
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('English');

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
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-stone-900">Settings</h2>
                        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                            <X size={20} className="text-stone-500" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Notifications */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-900">Notifications</p>
                                    <p className="text-xs text-stone-500">Receive booking updates</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setNotifications(!notifications);
                                    showToast(`Notifications ${!notifications ? 'enabled' : 'disabled'}`, 'info');
                                }}
                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-rose-500' : 'bg-stone-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        {/* Language */}
                        <div className="flex items-center justify-between cursor-pointer hover:bg-stone-50 p-2 -mx-2 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                                    <Globe size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-900">Language</p>
                                    <p className="text-xs text-stone-500">Current: {language}</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-stone-400" />
                        </div>

                        {/* Privacy & Security */}
                        <div className="flex items-center justify-between cursor-pointer hover:bg-stone-50 p-2 -mx-2 rounded-xl transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-stone-900">Privacy & Security</p>
                                    <p className="text-xs text-stone-500">Manage your data</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-stone-400" />
                        </div>
                    </div>

                    <div className="p-6 bg-stone-50 border-t border-stone-100 text-center">
                        <p className="text-xs text-stone-400 font-medium">Qurux App v1.0.0</p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
