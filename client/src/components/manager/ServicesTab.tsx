import React, { useState } from 'react';
import { Plus, Trash2, X, Sparkles, Scissors, PenTool, Droplets } from 'lucide-react';
import { Service } from '../../types';
import { Button } from '../Button';
import { motion, AnimatePresence } from 'framer-motion';

interface ServicesTabProps {
    myServices: Service[];
    addService: (service: Service) => void;
    removeService: (id: string) => void;
    mySalonId: string;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    confirmAction: (title: string, message: string, action: () => void, type?: 'danger' | 'warning') => void;
}

const STANDARD_SERVICES = [
    { nameSomali: 'Cilaan Saar', nameEnglish: 'Henna', category: 'Body', durationMin: 60, price: 15 },
    { nameSomali: 'Mikiyaajka', nameEnglish: 'Makeup', category: 'Face', durationMin: 45, price: 25 },
    { nameSomali: 'Timo Dabis', nameEnglish: 'Weaving', category: 'Hair', durationMin: 120, price: 40 },
    { nameSomali: 'Qurxinta Cidiyaha', nameEnglish: 'Manicure', category: 'Nails', durationMin: 40, price: 20 },
    { nameSomali: 'Timo Qurxin', nameEnglish: 'Hair Styling', category: 'Hair', durationMin: 60, price: 30 },
    { nameSomali: 'Wajiga Dhaqis', nameEnglish: 'Face Wash', category: 'Face', durationMin: 20, price: 10 },
    { nameSomali: 'Dhaqista Gacmaha', nameEnglish: 'Hand Wash', category: 'Body', durationMin: 15, price: 8 },
    { nameSomali: 'Dhaqista Lugaha', nameEnglish: 'Leg Wash', category: 'Body', durationMin: 20, price: 10 },
    { nameSomali: 'Dhaqista Jirka', nameEnglish: 'All Body Wash', category: 'Body', durationMin: 60, price: 50 },
    { nameSomali: 'Lashes Extension', nameEnglish: 'Lashes Extension', category: 'Face', durationMin: 90, price: 35 },
    { nameSomali: 'Nafaqaynta Timaha', nameEnglish: 'Hair Nutrition', category: 'Hair', durationMin: 45, price: 25 },
    { nameSomali: 'Daawaynta Timaha', nameEnglish: 'Hair Treatment', category: 'Hair', durationMin: 60, price: 40 },
    { nameSomali: 'Midabaynta Timaha', nameEnglish: 'Hair Colour', category: 'Hair', durationMin: 90, price: 45 }
];

export const ServicesTab: React.FC<ServicesTabProps> = ({ myServices, addService, removeService, mySalonId, showToast, confirmAction }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newService, setNewService] = useState({
        nameSomali: '', nameEnglish: '', price: 0, durationMin: 30, category: 'Hair'
    });

    const handleQuickAdd = (template: typeof STANDARD_SERVICES[0]) => {
        setNewService({
            nameSomali: template.nameSomali,
            nameEnglish: template.nameEnglish,
            price: template.price,
            durationMin: template.durationMin,
            category: template.category as any
        });
        setIsAdding(true);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Hair': return <Scissors size={20} />;
            case 'Nails': return <PenTool size={20} />;
            case 'Face': return <Sparkles size={20} />;
            case 'Body': return <Droplets size={20} />;
            default: return <Sparkles size={20} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-stone-100">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Your Services</h2>
                    <p className="text-stone-500">Manage your salon menu and pricing.</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="!py-3 !px-6 !text-sm clay-button flex items-center gap-2">
                    <Plus size={18} /> Add New Service
                </Button>
            </div>

            {/* Quick Add List */}
            <div className="bg-stone-50 p-6 rounded-[32px] border border-stone-100">
                <h3 className="text-sm font-bold text-stone-400 uppercase mb-4 flex items-center gap-2">
                    <Sparkles size={16} /> Quick Add Standard Services
                </h3>
                <div className="flex flex-wrap gap-3">
                    {STANDARD_SERVICES.map((s, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickAdd(s)}
                            className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 text-sm font-bold hover:border-rose-300 hover:text-rose-500 hover:shadow-md transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Plus size={14} /> {s.nameEnglish}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg hover:border-rose-100 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-rose-500">
                            {getCategoryIcon(service.category)}
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                                {getCategoryIcon(service.category)}
                            </div>
                            <div className="px-3 py-1 rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                                {service.durationMin} min
                            </div>
                        </div>

                        <h4 className="font-bold text-lg text-stone-900 mb-1">{service.nameEnglish}</h4>
                        <p className="text-sm text-stone-500 mb-4 font-medium">{service.nameSomali}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                            <span className="text-2xl font-bold text-stone-800">${service.price}</span>
                            <button
                                onClick={() => confirmAction(
                                    'Delete Service',
                                    `Are you sure you want to remove "${service.nameEnglish}"? This cannot be undone.`,
                                    () => {
                                        removeService(service.id);
                                        showToast('Service removed', 'success');
                                    }
                                )}
                                className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Service Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-stone-900">Add Custom Service</h3>
                                <button onClick={() => setIsAdding(false)} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Name (English)</label>
                                        <input
                                            value={newService.nameEnglish}
                                            onChange={e => setNewService({ ...newService, nameEnglish: e.target.value })}
                                            className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800"
                                            placeholder="e.g. Haircut"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Name (Somali)</label>
                                        <input
                                            value={newService.nameSomali}
                                            onChange={e => setNewService({ ...newService, nameSomali: e.target.value })}
                                            className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800"
                                            placeholder="e.g. Timo Jar"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Price ($)</label>
                                        <input
                                            type="number"
                                            value={newService.price || ''}
                                            onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                                            className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Duration (min)</label>
                                        <input
                                            type="number"
                                            value={newService.durationMin || ''}
                                            onChange={e => setNewService({ ...newService, durationMin: Number(e.target.value) })}
                                            className="w-full p-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800"
                                            placeholder="30"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Category</label>
                                    <div className="flex gap-2">
                                        {['Hair', 'Face', 'Body', 'Nails'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setNewService({ ...newService, category: cat })}
                                                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${newService.category === cat ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={() => {
                                        if (!newService.nameSomali || !newService.nameEnglish) return;
                                        addService({
                                            id: Math.random().toString(),
                                            salonId: mySalonId,
                                            ...newService,
                                            iconName: 'Sparkles',
                                            category: newService.category as any
                                        });
                                        showToast('Service Added', 'success');
                                        setNewService({ nameSomali: '', nameEnglish: '', price: 0, durationMin: 30, category: 'Hair' });
                                        setIsAdding(false);
                                    }}
                                    fullWidth
                                    className="mt-4 clay-button"
                                >
                                    Save Service
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
