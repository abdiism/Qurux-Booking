import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Sparkles, Clock, Instagram, Facebook } from 'lucide-react';
import { Salon, Service } from '../../types';
import { Button } from '../Button';

import { ImageCarousel } from '../ImageCarousel';

interface ServicesListProps {
    selectedSalon: Salon | null;
    services: Service[];
    salons: Salon[];
    onServiceSelect: (service: Service) => void;
    formatPrice: (price: number) => string;
    onSalonClick?: (salon: Salon) => void;
    searchQuery?: string;
}

export const ServicesList: React.FC<ServicesListProps> = ({ selectedSalon, services, salons, onServiceSelect, formatPrice, onSalonClick, searchQuery = '' }) => {
    // Filtering
    const displayedServices = selectedSalon
        ? services.filter(s => s.salonId === selectedSalon.id)
        : services;

    const categories = ['All', ...Array.from(new Set(displayedServices.map(s => s.category)))];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredServices = displayedServices.filter(s => {
        const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
        const query = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            s.nameSomali.toLowerCase().includes(query) ||
            s.nameEnglish.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
    });

    return (
        <motion.div
            key="services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >

            {/* Salon Hero */}
            {selectedSalon && (
                <>
                    <div className="relative h-[300px] md:h-[400px] rounded-[40px] overflow-hidden mb-10 shadow-2xl shadow-rose-200/50 clay-card border-none">
                        <ImageCarousel
                            images={selectedSalon.images && selectedSalon.images.length > 0 ? selectedSalon.images : [selectedSalon.image]}
                            interval={5000}
                            className="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-6xl font-bold mb-4"
                            >
                                {selectedSalon.name}
                            </motion.h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full"><Star size={16} className="fill-white" /> {selectedSalon.rating}</span>
                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                    <MapPin size={16} /> {selectedSalon.address}{selectedSalon.city ? `, ${selectedSalon.city}` : ''}
                                </span>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 hidden md:flex gap-2 pointer-events-auto">
                            {selectedSalon.socialLinks?.instagram && (
                                <a href={selectedSalon.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-pink-500 transition-colors shadow-sm">
                                    <Instagram size={14} />
                                </a>
                            )}
                            {selectedSalon.socialLinks?.facebook && (
                                <a href={selectedSalon.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-blue-600 transition-colors shadow-sm">
                                    <Facebook size={14} />
                                </a>
                            )}
                            {selectedSalon.socialLinks?.tiktok && (
                                <a href={selectedSalon.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors shadow-sm">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Salon Details Section (Description & Mobile Socials) */}
                    <div className="mb-10 px-2">
                        <p className="text-stone-500 leading-relaxed mb-4 font-medium max-w-3xl">{selectedSalon.description}</p>
                    </div>
                </>
            )}

            {!selectedSalon && (
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-stone-900">All Services</h2>
                    <p className="text-stone-500">Browsing all treatments across our partner network</p>
                </div>
            )}

            {/* Categories */}
            <div className="sticky top-20 z-30 bg-[#fff1f2]/95 backdrop-blur-sm py-4 mb-4 -mx-6 px-6">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${selectedCategory === cat
                                ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-200'
                                : 'bg-white text-stone-500 border-stone-100 hover:border-rose-200 hover:text-rose-500'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                {filteredServices.map((service, idx) => {
                    const serviceSalon = !selectedSalon ? salons.find(s => s.id === service.salonId) : selectedSalon;
                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onServiceSelect(service)}
                            className="clay-card p-6 rounded-3xl cursor-pointer group hover:-translate-y-1 transition-transform duration-300"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0 shadow-sm">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-600 transition-colors">{service.nameSomali}</h3>
                                    <p className="text-stone-500 text-sm mb-1 font-medium">{service.nameEnglish}</p>
                                    {!selectedSalon && serviceSalon && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSalonClick?.(serviceSalon);
                                            }}
                                            className="text-xs font-bold text-rose-400 mb-2 hover:underline text-left block"
                                        >
                                            {serviceSalon.name}
                                        </button>
                                    )}
                                    <span className="text-xs bg-stone-100 px-2 py-1 rounded-lg text-stone-500 font-bold inline-flex items-center gap-1">
                                        <Clock size={12} /> {service.durationMin} min
                                    </span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <span className="block text-xl font-bold text-stone-900 mb-2">{formatPrice(service.price)}</span>
                                <Button className="!py-2 !px-4 !text-xs !rounded-xl clay-button" onClick={(e) => {
                                    e.stopPropagation();
                                    onServiceSelect(service);
                                }}>
                                    Book
                                </Button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};
