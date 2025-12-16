import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { ClientBookings } from './customer/ClientBookings';
import { bookingService } from '../services/bookingService';
import { ConfirmationModal } from './ConfirmationModal';

interface ClientBookingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ClientBookingsModal: React.FC<ClientBookingsModalProps> = ({ isOpen, onClose }) => {
    const { bookings, salons, services, cancelBooking, currentUser } = useApp();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Filter bookings for current user
    const myBookings = bookings.filter(b => b.customerId === currentUser?.id);

    const [confirmCancel, setConfirmCancel] = useState<{ isOpen: boolean; bookingId: string | null }>({
        isOpen: false,
        bookingId: null
    });

    const handleCancelClick = (bookingId: string) => {
        setConfirmCancel({ isOpen: true, bookingId });
    };

    const handleConfirmCancel = async () => {
        if (!confirmCancel.bookingId) return;

        setLoading(true);
        try {
            await cancelBooking(confirmCancel.bookingId);
            showToast('Booking cancelled successfully', 'success');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            showToast('Failed to cancel booking', 'error');
        } finally {
            setLoading(false);
            setConfirmCancel({ isOpen: false, bookingId: null });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-2xl clay-card rounded-[32px] p-8 overflow-hidden bg-white max-h-[85vh] flex flex-col"
            >
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 shadow-inner">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-stone-900">My Bookings</h2>
                            <p className="text-stone-500 text-sm font-medium">Manage your appointments.</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                            <Loader2 className="animate-spin text-rose-500" size={32} />
                        </div>
                    )}
                    <ClientBookings
                        bookings={myBookings}
                        salons={salons}
                        services={services}
                        onCancel={handleCancelClick}
                    />
                </div>
            </motion.div>

            <ConfirmationModal
                isOpen={confirmCancel.isOpen}
                onClose={() => setConfirmCancel({ isOpen: false, bookingId: null })}
                onConfirm={handleConfirmCancel}
                title="Cancel Booking?"
                message="Are you sure you want to cancel this appointment? This action cannot be undone."
                confirmText="Yes, Cancel It"
                type="danger"
                isLoading={loading}
            />
        </div>
    );
};
