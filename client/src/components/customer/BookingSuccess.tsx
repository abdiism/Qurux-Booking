import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Salon, Service, PaymentMethod } from '../../types';
import { Button } from '../Button';

interface BookingSuccessProps {
    selectedService: Service | null;
    selectedSalon: Salon | null;
    bookingDate: Date;
    selectedSlots: string[];
    paymentMethod: PaymentMethod | '';
    totalPrice: number;
    formatPrice: (price: number) => string;
    onBackToHome: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({
    selectedService, selectedSalon, bookingDate, selectedSlots, paymentMethod, totalPrice, formatPrice, onBackToHome
}) => {
    return (
        <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg mx-auto text-center pt-10"
        >
            <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-8 mx-auto shadow-2xl shadow-green-100/50">
                <CheckCircle size={64} />
            </div>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">You're Booked!</h2>
            <p className="text-lg text-stone-500 mb-10 font-medium">
                Your appointment for <span className="text-rose-500 font-bold">{selectedService?.nameEnglish}</span> at <span className="text-stone-800 font-bold">{selectedSalon?.name}</span> is confirmed.
            </p>

            <div className="clay-card p-8 rounded-[32px] w-full mb-10 text-left relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10" />

                <div className="grid grid-cols-2 gap-6 relative z-10">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Date</p>
                        <p className="text-lg font-bold text-stone-800">{bookingDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Time</p>
                        <p className="text-sm font-bold text-stone-800 break-words">{selectedSlots.join(', ')}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Payment</p>
                        <p className="text-lg font-bold text-stone-800">{paymentMethod}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase mb-1">Amount</p>
                        <p className="text-lg font-bold text-rose-500">{formatPrice(totalPrice)}</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={onBackToHome} className="!py-4 !px-12 !rounded-full clay-button">
                    Back to Home
                </Button>
            </div>
        </motion.div>
    );
};
