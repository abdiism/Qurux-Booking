import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Plus, Minus, ArrowRight } from 'lucide-react';
import { Service } from '../../types';
import { Button } from '../Button';
import { Calendar } from '../Calendar';
import { TIME_SLOTS } from '../../constants';

interface BookingScheduleProps {
    selectedService: Service;
    bookingDate: Date;
    setBookingDate: (date: Date) => void;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
    multiSlotMode: boolean;
    setMultiSlotMode: (mode: boolean) => void;
    totalPrice: number;
    formatPrice: (price: number) => string;
    onNext: () => void;
    bookedSlots: string[];
}

export const BookingSchedule: React.FC<BookingScheduleProps> = ({
    selectedService, bookingDate, setBookingDate, selectedSlots, setSelectedSlots,
    multiSlotMode, setMultiSlotMode, totalPrice, formatPrice, onNext, bookedSlots
}) => {

    const toggleSlot = (slot: string) => {
        if (multiSlotMode) {
            if (selectedSlots.includes(slot)) {
                setSelectedSlots(prev => prev.filter(s => s !== slot));
            } else {
                setSelectedSlots(prev => [...prev, slot]);
            }
        } else {
            setSelectedSlots([slot]);
        }
    };

    return (
        <motion.div
            key="schedule"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto pb-32"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-900">Select a time</h2>
                <p className="text-stone-500 font-medium">When should we expect you?</p>
            </div>

            <div className="clay-card rounded-[40px] p-6 md:p-8 mb-8 bg-white/70">
                {/* Service Info */}
                <div className="flex justify-between items-center mb-8 pb-8 border-b border-stone-100">
                    <div>
                        <h3 className="font-bold text-xl text-stone-900">{selectedService.nameEnglish}</h3>
                        <p className="text-rose-500 font-bold text-sm">{selectedService.durationMin} minutes per slot</p>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-stone-900 block">{formatPrice(totalPrice || selectedService.price)}</span>
                        {selectedSlots.length > 1 && (
                            <span className="text-xs text-stone-500 font-bold">{selectedSlots.length} slots</span>
                        )}
                    </div>
                </div>

                {/* Calendar */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-stone-400 uppercase mb-4 block tracking-wider">Select Date</label>
                    <Calendar selectedDate={bookingDate} onSelectDate={(d) => { setBookingDate(d); setSelectedSlots([]); }} />
                </div>

                {/* Time Slots */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Available Slots</label>

                        {/* Multi-slot Toggle */}
                        <button
                            onClick={() => {
                                setMultiSlotMode(!multiSlotMode);
                                setSelectedSlots([]);
                            }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${multiSlotMode ? 'bg-rose-500 text-white shadow-md' : 'bg-stone-100 text-stone-500'
                                }`}
                        >
                            {multiSlotMode ? <Minus size={12} /> : <Plus size={12} />}
                            {multiSlotMode ? 'Multi-select ON' : 'Multi-select OFF'}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {TIME_SLOTS.map(slot => {
                            const isBooked = bookedSlots.includes(slot);
                            const isSelected = selectedSlots.includes(slot);
                            const isDisabled = isBooked || ((slot === '12:00 PM' || slot === '04:00 PM') && bookingDate.getDate() % 2 === 0 && false); // Removed logic for disabled test

                            return (
                                <button
                                    key={slot}
                                    disabled={isDisabled}
                                    onClick={() => toggleSlot(slot)}
                                    className={`py-3 px-2 rounded-2xl text-sm font-bold border transition-all relative overflow-hidden ${isSelected
                                        ? 'bg-stone-900 text-white border-stone-900 shadow-xl'
                                        : isDisabled
                                            ? 'border-stone-50 text-stone-300 bg-stone-50/50 cursor-not-allowed decoration-slice line-through'
                                            : 'bg-white border-stone-100 text-stone-500 hover:border-rose-300 hover:text-rose-600'
                                        }`}
                                >
                                    {slot}
                                    {isSelected && multiSlotMode && (
                                        <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                                    )}
                                    {isBooked && (
                                        <div className="absolute inset-0 bg-stone-100/50 flex items-center justify-center">
                                            {/* Optional lock icon or similar */}
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                    {selectedService.durationMin > 60 && selectedSlots.length === 1 && (
                        <p className="text-xs text-orange-500 mt-4 flex items-center gap-1 font-semibold">
                            <Clock size={12} /> Longer service. We recommend checking availability for consecutive slots.
                        </p>
                    )}
                </div>
            </div>

            {/* Floating Booking Bar */}
            <div className="fixed bottom-6 left-6 right-6 z-50">
                <div className="max-w-xl mx-auto clay-card p-4 rounded-3xl flex items-center justify-between bg-white/90 backdrop-blur-xl shadow-2xl border-white/50">
                    <div>
                        <p className="text-xs font-bold text-stone-400 uppercase">Total</p>
                        <p className="text-xl font-bold text-stone-900">{formatPrice(totalPrice)}</p>
                    </div>
                    <Button
                        onClick={onNext}
                        disabled={selectedSlots.length === 0}
                        className={`!py-3 !px-8 !rounded-xl !text-sm clay-button ${selectedSlots.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Payment <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
