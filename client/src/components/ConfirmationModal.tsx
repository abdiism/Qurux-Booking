import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
    manualClose?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger',
    isLoading = false,
    manualClose = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={!isLoading ? onClose : undefined}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-[90vw] max-w-sm clay-card rounded-[32px] p-6 sm:p-8 overflow-hidden bg-white shadow-2xl"
            >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner ${type === 'danger' ? 'bg-red-100 text-red-500' :
                    type === 'warning' ? 'bg-orange-100 text-orange-500' :
                        'bg-blue-100 text-blue-500'
                    }`}>
                    <AlertTriangle size={32} />
                </div>

                <h3 className="text-2xl font-bold text-stone-900 text-center mb-2">{title}</h3>
                <p className="text-stone-500 text-center mb-8 font-medium leading-relaxed">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <Button
                        onClick={() => {
                            onConfirm();
                            if (!manualClose) onClose();
                        }}
                        disabled={isLoading}
                        className={`flex-1 !py-3 !rounded-xl clay-button flex items-center justify-center gap-2 ${type === 'danger' ? '!bg-red-500 hover:!bg-red-600' : ''
                            }`}
                    >
                        {isLoading && <Loader2 size={18} className="animate-spin" />}
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};
