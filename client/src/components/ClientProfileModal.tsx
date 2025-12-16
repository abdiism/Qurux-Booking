import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Button } from './Button';
import { profileService } from '../services/profileService';

interface ClientProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ClientProfileModal: React.FC<ClientProfileModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, setCurrentUser } = useApp();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        location: ''
    });

    React.useEffect(() => {
        if (currentUser) {
            setFormData({
                full_name: currentUser.name || '',
                phone_number: currentUser.phoneNumber || '',
                location: '' // Add location if available in future
            });
        }
    }, [currentUser, isOpen]);

    if (!isOpen || !currentUser) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            await profileService.updateProfile(currentUser.id, {
                full_name: formData.full_name,
                phone_number: formData.phone_number,
                location: formData.location
            });

            // Update local state
            setCurrentUser({
                ...currentUser,
                name: formData.full_name,
                phoneNumber: formData.phone_number
            });

            showToast('Profile updated successfully', 'success');
            onClose();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            showToast(error.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl clay-card rounded-[32px] p-8 overflow-hidden bg-white shadow-2xl max-h-[90vh] flex flex-col"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-stone-200 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="mb-8 relative z-10">
                    <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-4 shadow-inner">
                        <User size={28} />
                    </div>
                    <h2 className="text-3xl font-bold text-stone-900 mb-2">Edit Profile</h2>
                    <p className="text-stone-500 font-medium">Update your personal information.</p>
                </div>

                <div className="space-y-4 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                            <input
                                value={formData.full_name}
                                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900"
                                placeholder="Your Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                            <input
                                value={formData.phone_number}
                                onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900"
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Location (Optional)</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-rose-500 transition-colors" size={20} />
                            <input
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-rose-500 focus:bg-white outline-none transition-all font-bold text-stone-900"
                                placeholder="City, District"
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        <Button onClick={handleSave} disabled={loading} fullWidth className="clay-button">
                            {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
