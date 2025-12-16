import React, { useState } from 'react';
import { Grid, MapPin, Image as ImageIcon, XCircle, Globe, Instagram, Facebook, Twitter, Save, Upload, Phone, Loader2 } from 'lucide-react';
import { Salon } from '../../types';
import { Button } from '../Button';
import { supabase } from '../../lib/supabase';

interface ProfileTabProps {
    mySalon: Salon;
    updateSalonDetails: (salon: Salon) => Promise<void>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ mySalon, updateSalonDetails, showToast }) => {
    const [details, setDetails] = useState({
        name: mySalon.name,
        address: mySalon.address,
        city: mySalon.city || '',
        phoneNumber: mySalon.phoneNumber || '',
        latitude: mySalon.latitude || 0,
        longitude: mySalon.longitude || 0,
        description: mySalon.description,
        image: mySalon.image,
        images: mySalon.images || [mySalon.image],
        socialLinks: {
            instagram: mySalon.socialLinks?.instagram || '',
            facebook: mySalon.socialLinks?.facebook || '',
            tiktok: mySalon.socialLinks?.tiktok || '',
            twitter: mySalon.socialLinks?.twitter || ''
        }
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [uploading, setUploading] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!details.name.trim()) newErrors.name = 'Salon Name is required';
        if (!details.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
        if (!details.city.trim()) newErrors.city = 'City is required';
        if (!details.address.trim()) newErrors.address = 'Address is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            showToast('Please fix the errors highlighted in red.', 'error');
            return;
        }

        try {
            await updateSalonDetails({
                ...mySalon,
                ...details
            });
            showToast('Profile Updated Successfully', 'success');
        } catch (error: any) {
            console.error(error);
            const msg = error.message || 'Failed to update profile';
            showToast(msg, 'error');
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        // 1. Check Max Images (10)
        if (details.images.length >= 10) {
            showToast('Maximum 10 images reached. Please delete an image to upload a new one.', 'error');
            return;
        }

        const file = event.target.files[0];

        // 2. Check Max Size (3MB)
        if (file.size > 3 * 1024 * 1024) {
            showToast('Image is too large (Max 3MB). Please compress it or choose a smaller file.', 'error');
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('salon-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('salon-images')
                .getPublicUrl(filePath);

            if (data) {
                setDetails(prev => {
                    const newImages = [...prev.images, data.publicUrl];
                    // Cover is always the first image
                    return {
                        ...prev,
                        images: newImages,
                        image: newImages[0]
                    };
                });
                showToast('Image uploaded successfully', 'success');
            }
        } catch (error: any) {
            console.error('Error uploading image:', error);
            showToast('Error uploading image: ' + error.message, 'error');
        } finally {
            setUploading(false);
            // Reset input
            event.target.value = '';
        }
    };

    const removeImage = (index: number) => {
        setDetails(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                image: newImages.length > 0 ? newImages[0] : '' // Update cover if first image removed
            };
        });
    };

    const makeCover = (index: number) => {
        setDetails(prev => {
            const imageToMove = prev.images[index];
            const otherImages = prev.images.filter((_, i) => i !== index);
            const newImages = [imageToMove, ...otherImages];
            return {
                ...prev,
                images: newImages,
                image: newImages[0]
            };
        });
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900">Salon Profile</h2>
                    <p className="text-stone-500">Manage your salon's public appearance.</p>
                </div>
                <Button onClick={handleSave} className="!py-3 !px-6 clay-button flex items-center gap-2">
                    <Save size={18} /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info Section */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
                            <Grid size={20} className="text-rose-500" /> Basic Information
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Salon Name *</label>
                                <input
                                    value={details.name}
                                    onChange={e => {
                                        setDetails({ ...details, name: e.target.value });
                                        if (errors.name) setErrors({ ...errors, name: '' });
                                    }}
                                    className={`w-full p-4 bg-stone-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800 text-lg ${errors.name ? 'border-2 border-red-500 bg-red-50' : 'border-none'}`}
                                    placeholder="Enter Salon Name"
                                />
                                {errors.name && <p className="text-red-500 text-xs font-bold mt-2 ml-1 flex items-center gap-1"><XCircle size={12} /> {errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Description</label>
                                <textarea
                                    value={details.description}
                                    onChange={e => setDetails({ ...details, description: e.target.value })}
                                    className="w-full p-4 bg-stone-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-medium text-stone-800 h-32 resize-none leading-relaxed"
                                    placeholder="Describe your salon..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Location Section */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
                            <MapPin size={20} className="text-orange-500" /> Contact & Location
                        </h3>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Phone Number *</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    value={details.phoneNumber}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (/^[0-9+]*$/.test(val)) {
                                            setDetails({ ...details, phoneNumber: val });
                                            if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                                        }
                                    }}
                                    className={`w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800 ${errors.phoneNumber ? 'border-2 border-red-500 bg-red-50' : 'border-none'}`}
                                    placeholder="+252 63..."
                                />
                            </div>
                            {errors.phoneNumber && <p className="text-red-500 text-xs font-bold mt-2 ml-1 flex items-center gap-1"><XCircle size={12} /> {errors.phoneNumber}</p>}
                            <p className="text-xs text-stone-400 mt-2 ml-1">Numbers only. This number will be used for clients to contact you.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">City *</label>
                                <input
                                    value={details.city}
                                    onChange={e => {
                                        setDetails({ ...details, city: e.target.value });
                                        if (errors.city) setErrors({ ...errors, city: '' });
                                    }}
                                    className={`w-full p-3 bg-stone-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800 ${errors.city ? 'border-2 border-red-500 bg-red-50' : 'border-none'}`}
                                    placeholder="e.g. Mogadishu"
                                />
                                {errors.city && <p className="text-red-500 text-xs font-bold mt-2 ml-1 flex items-center gap-1"><XCircle size={12} /> {errors.city}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Address *</label>
                                <input
                                    value={details.address}
                                    onChange={e => {
                                        setDetails({ ...details, address: e.target.value });
                                        if (errors.address) setErrors({ ...errors, address: '' });
                                    }}
                                    className={`w-full p-3 bg-stone-50 rounded-xl outline-none focus:ring-2 focus:ring-rose-200 font-bold text-stone-800 ${errors.address ? 'border-2 border-red-500 bg-red-50' : 'border-none'}`}
                                    placeholder="Building/Street Name"
                                />
                                {errors.address && <p className="text-red-500 text-xs font-bold mt-2 ml-1 flex items-center gap-1"><XCircle size={12} /> {errors.address}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Latitude</label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                    <input
                                        type="number"
                                        value={details.latitude}
                                        onChange={e => setDetails({ ...details, latitude: parseFloat(e.target.value) || 0 })}
                                        className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-medium text-stone-800"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-400 uppercase mb-2 ml-1">Longitude</label>
                                <div className="relative">
                                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                    <input
                                        type="number"
                                        value={details.longitude}
                                        onChange={e => setDetails({ ...details, longitude: parseFloat(e.target.value) || 0 })}
                                        className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-medium text-stone-800"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <button
                                    onClick={() => {
                                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                        if (isMobile) {
                                            showToast('Please use laptop browser for this', 'info');
                                            return;
                                        }

                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((position) => {
                                                setDetails(prev => ({
                                                    ...prev,
                                                    latitude: position.coords.latitude,
                                                    longitude: position.coords.longitude
                                                }));
                                                showToast('Location detected!', 'success');
                                            }, (error) => {
                                                showToast('Unable to retrieve location', 'error');
                                            });
                                        } else {
                                            showToast('Geolocation is not supported by this browser.', 'error');
                                        }
                                    }}
                                    className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                                >
                                    <MapPin size={14} /> Get Current Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Media & Socials */}
                <div className="space-y-8">
                    {/* Social Media */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
                            <Globe size={20} className="text-blue-500" /> Social Media
                        </h3>
                        <div className="space-y-4">
                            <div className="relative group">
                                <Instagram size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" />
                                <input
                                    value={details.socialLinks.instagram}
                                    onChange={e => setDetails({ ...details, socialLinks: { ...details.socialLinks, instagram: e.target.value } })}
                                    placeholder="Instagram Username"
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-medium text-stone-800"
                                />
                            </div>
                            <div className="relative group">
                                <Facebook size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600" />
                                <input
                                    value={details.socialLinks.facebook}
                                    onChange={e => setDetails({ ...details, socialLinks: { ...details.socialLinks, facebook: e.target.value } })}
                                    placeholder="Facebook URL"
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-medium text-stone-800"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xs text-black">Tk</span>
                                <input
                                    value={details.socialLinks.tiktok}
                                    onChange={e => setDetails({ ...details, socialLinks: { ...details.socialLinks, tiktok: e.target.value } })}
                                    placeholder="TikTok Username"
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 font-medium text-stone-800"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
                        <h3 className="font-bold text-lg text-stone-900 mb-6 flex items-center gap-2">
                            <ImageIcon size={20} className="text-purple-500" /> Gallery
                        </h3>

                        <div className="mb-4">
                            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all group">
                                <div className="flex flex-col items-center gap-2 text-stone-400 group-hover:text-rose-500">
                                    {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                    <span className="text-sm font-bold">{uploading ? 'Uploading...' : 'Upload Image'}</span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {details.images.map((img, idx) => (
                                <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square shadow-sm">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {idx !== 0 && (
                                            <button
                                                onClick={() => makeCover(idx)}
                                                className="px-3 py-1 bg-white text-stone-900 text-xs font-bold rounded-full hover:bg-rose-50 transition-colors"
                                            >
                                                Make Cover
                                            </button>
                                        )}
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                    {idx === 0 && (
                                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            Cover
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
