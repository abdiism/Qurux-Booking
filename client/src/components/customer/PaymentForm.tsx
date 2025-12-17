import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, ArrowRight } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { PAYMENT_METHODS } from '../../constants';
import { Button } from '../Button';

interface PaymentFormProps {
    paymentMethod: PaymentMethod | '';
    setPaymentMethod: (method: PaymentMethod) => void;
    onConfirm: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ paymentMethod, setPaymentMethod, onConfirm }) => {
    return (
        <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-900">Payment Method</h2>
                <p className="text-stone-500 font-medium">Secure and local payment options.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {PAYMENT_METHODS.map(method => (
                    <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`clay-card p-6 rounded-3xl flex items-center gap-6 cursor-pointer transition-all ${paymentMethod === method.id
                            ? 'border-rose-500 ring-2 ring-rose-200 bg-white'
                            : 'border-white/40 bg-white/60 hover:bg-white/80'
                            }`}
                    >
                        <div className={`w-14 h-14 rounded-2xl ${method.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                            <CreditCard size={24} />
                        </div>
                        <div className="flex-1">
                            <span className="block font-bold text-lg text-stone-800">{method.label}</span>
                            <span className="text-xs text-stone-400 font-medium">Instant processing</span>
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method.id ? 'border-rose-500 bg-rose-500 text-white' : 'border-stone-300'
                            }`}>
                            {paymentMethod === method.id && <CheckCircle size={14} />}
                        </div>
                    </motion.div>
                ))}
            </div>

            <Button
                fullWidth
                onClick={onConfirm}
                disabled={!paymentMethod}
                className={`!py-4 !rounded-2xl !text-lg clay-button ${!paymentMethod ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                Confirm Payment <ArrowRight size={20} />
            </Button>
        </motion.div>
    );
};
