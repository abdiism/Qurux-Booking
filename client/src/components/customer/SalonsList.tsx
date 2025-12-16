import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, MapPin, Instagram, Facebook } from 'lucide-react';
import { Salon } from '../../types';

import { ImageCarousel } from '../ImageCarousel';

interface SalonsListProps {
    salons: Salon[];
    onSalonSelect: (salon: Salon) => void;
}

export const SalonsList: React.FC<SalonsListProps> = ({ salons, onSalonSelect }) => {
    return (
        <motion.div
            key="salons"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
        >
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">Find your <span className="text-rose-500">glow.</span></h2>
                <p className="text-lg text-stone-500 max-w-lg mx-auto">Explore the best rated salons in your city for henna, hair, and spa treatments.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {salons.map((salon, idx) => (
                    <motion.div
                        key={salon.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -8 }}
                        onClick={() => onSalonSelect(salon)}
                        className="clay-card rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer group hover:shadow-2xl hover:shadow-rose-100 transition-all duration-300 border-none flex flex-row md:flex-col h-32 md:h-auto"
                    >



                        <div className="w-32 md:w-full h-full md:h-64 bg-stone-200 relative overflow-hidden flex-shrink-0">
                            <ImageCarousel
                                images={salon.images && salon.images.length > 0 ? salon.images : [salon.image]}
                                interval={4000}
                                className="w-full h-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 hidden md:block pointer-events-none" />
                            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 text-xs md:text-sm font-bold text-stone-800 shadow-sm">
                                <Star size={12} className="text-orange-400 fill-orange-400" /> {salon.rating}
                            </div>
                            {salon.city && (
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-bold text-white shadow-sm hidden md:flex">
                                    <MapPin size={14} /> {salon.city}
                                </div>
                            )}
                        </div>
                        <div className="p-4 md:p-6 flex flex-col justify-center md:block flex-1">
                            <h3 className="text-lg md:text-2xl font-bold text-stone-800 mb-1 md:mb-2 group-hover:text-rose-500 transition-colors line-clamp-1">{salon.name}</h3>
                            <p className="text-stone-500 text-xs md:text-sm leading-relaxed mb-2 md:mb-6 line-clamp-2 font-medium hidden md:block">{salon.description}</p>

                            {/* Mobile City Display */}
                            {salon.city && (
                                <div className="flex items-center gap-1 text-xs text-stone-400 font-bold mb-2 md:hidden">
                                    <MapPin size={12} /> {salon.city}
                                </div>
                            )}

                            <div className="flex items-center justify-end mt-auto md:mt-4">
                                <button className="px-3 py-1.5 md:px-4 md:py-2 bg-rose-500 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors flex items-center gap-2">
                                    Book <ArrowRight size={14} className="hidden md:block" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
