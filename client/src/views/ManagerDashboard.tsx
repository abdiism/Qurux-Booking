import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import {
    Settings, Grid, Calendar, List, LogOut, Loader2, Sparkles
} from 'lucide-react';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { OverviewTab } from '../components/manager/OverviewTab';
import { BookingsTab } from '../components/manager/BookingsTab';
import { ServicesTab } from '../components/manager/ServicesTab';
import { ProfileTab } from '../components/manager/ProfileTab';
import { Salon } from '../types';


type Tab = 'overview' | 'bookings' | 'services' | 'profile';

export const ManagerDashboard = () => {
    const {
        bookings,
        services,
        updateBookingStatus,
        addService,
        removeService,
        updateSalonDetails,
        createSalon,
        salons,
        currentUser,
        loading,
        logout,
        setCurrentView
    } = useApp();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'danger' as 'danger' | 'warning'
    });

    const confirmAction = (title: string, message: string, action: () => void, type: 'danger' | 'warning' = 'danger') => {
        setConfirmation({
            isOpen: true,
            title,
            message,
            onConfirm: action,
            type
        });
    };

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = () => {
        confirmAction(
            'Log Out',
            'Are you sure you want to log out of the manager portal?',
            async () => {
                setIsLoggingOut(true);
                await new Promise(resolve => setTimeout(resolve, 800));
                await logout();
                showToast('Logged out successfully', 'info');
                setCurrentView('LANDING');
            },
            'warning'
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <Loader2 className="animate-spin text-rose-500" size={48} />
            </div>
        );
    }

    // 1. Find the salon owned by the current user
    const mySalon = salons.find(s => s.ownerId === currentUser?.id);

    // 2. If NO SALON exists, show the ONBOARDING (Create Salon) view
    if (!mySalon) {
        // Empty template for new salon
        const newSalonTemplate: Salon = {
            id: 'new',
            name: '',
            description: '',
            address: '',
            image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1000', // Default placeholder
            rating: 5,
            reviewCount: 0,
            ownerId: currentUser?.id,
            images: [],
            city: '',
            phoneNumber: currentUser?.phoneNumber || '',
            socialLinks: { instagram: '', facebook: '', tiktok: '', twitter: '' }
        };

        const handleCreateSalon = async (salonData: Salon) => {
            // Strip ID and stats before creating
            const { id, rating, reviewCount, ...creationData } = salonData;
            // This will throw if it fails (e.g. 409 Conflict), which ProfileTab will catch and display
            await createSalon({
                ...creationData,
                ownerId: currentUser!.id // Ensure ownerId is secure
            });
            // Success is handled by the re-render (mySalon will populate)
        };

        return (
            <div className="min-h-screen bg-stone-50 font-sans p-6 pb-24">
                <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
                                <Sparkles className="text-rose-500" /> Welcome, Manager!
                            </h1>
                            <p className="text-stone-500 mt-2">To get started, please set up your salon profile.</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-stone-500 hover:bg-stone-100 font-bold transition-all shadow-sm"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </header>

                    {/* Reuse ProfileTab for Creation */}
                    <ProfileTab
                        mySalon={newSalonTemplate}
                        updateSalonDetails={handleCreateSalon}
                        showToast={showToast}
                    />
                </div>

                <ConfirmationModal
                    isOpen={confirmation.isOpen}
                    onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                    onConfirm={confirmation.onConfirm}
                    title={confirmation.title}
                    message={confirmation.message}
                    type={confirmation.type}
                />
            </div>
        );
    }

    // 3. If Salon EXISTS, show the Dashbaord
    const mySalonId = mySalon.id;
    const myServices = services.filter(s => s.salonId === mySalonId);
    const myBookings = bookings.filter(b => b.salonId === mySalonId);

    // --- STATS ---
    const totalRevenue = myBookings.reduce((sum, b) => b.status !== 'Declined' ? sum + b.totalPrice : sum, 0);
    const pendingBookings = myBookings.filter(b => b.status === 'Pending').length;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-900 font-sans flex transition-colors duration-300">
            {/* Sidebar (Desktop) */}
            <div className="hidden lg:flex w-64 bg-white dark:bg-stone-800 border-r border-stone-100 dark:border-stone-700 flex-col p-6 fixed h-full z-30 transition-colors duration-300">
                <div className="text-rose-500 font-bold text-2xl mb-12 flex items-center gap-2">
                    <span className="bg-rose-500 text-white rounded-xl p-2 shadow-lg shadow-rose-200"><Settings size={20} /></span> Manager
                </div>
                <nav className="space-y-2">
                    {[
                        { id: 'overview', icon: Grid, label: 'Overview' },
                        { id: 'bookings', icon: Calendar, label: 'Bookings' },
                        { id: 'services', icon: List, label: 'Services' },
                        { id: 'profile', icon: Settings, label: 'Salon Profile' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === item.id
                                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-105'
                                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-700 hover:text-stone-800 dark:hover:text-stone-200'
                                }`}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-auto pt-8 border-t border-stone-100">
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-stone-500 dark:text-stone-400 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                    >
                        {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                        {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                    </button>
                </div>
            </div>

            {/* Mobile Header / Main Content */}
            <div className="lg:ml-64 flex-1 p-6 pb-24 lg:pb-6">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-stone-900 dark:text-white capitalize">{activeTab}</h1>
                        <p className="text-stone-500">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <p className="text-sm font-bold text-stone-900 dark:text-white">{mySalon.name}</p>
                            <p className="text-xs text-stone-500">Manager Portal</p>
                        </div>
                        <div className="w-10 h-10 bg-stone-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img src={mySalon.image} alt={mySalon.name} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <button onClick={handleLogout} disabled={isLoggingOut} className="lg:hidden p-2 bg-stone-100 rounded-full text-stone-500 hover:bg-red-100 hover:text-red-500 transition-colors disabled:opacity-50 ml-4">
                        {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />}
                    </button>
                </header>

                {/* Mobile Tabs */}
                <div className="lg:hidden flex overflow-x-auto gap-2 mb-6 no-scrollbar pb-2">
                    {['Overview', 'Bookings', 'Services', 'Profile'].map(t => {
                        const id = t.toLowerCase() as Tab;
                        return (
                            <button
                                key={t}
                                onClick={() => setActiveTab(id)}
                                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === id ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-white text-stone-500 border border-stone-200'
                                    }`}
                            >
                                {t}
                            </button>
                        )
                    })}
                </div>

                <main className="max-w-7xl mx-auto">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            totalRevenue={totalRevenue}
                            myBookings={myBookings}
                            pendingBookings={pendingBookings}
                            myServices={myServices}
                        />
                    )}
                    {activeTab === 'bookings' && (
                        <BookingsTab
                            myBookings={myBookings}
                            services={services}
                            updateBookingStatus={updateBookingStatus}
                            showToast={showToast}
                        />
                    )}
                    {activeTab === 'services' && (
                        <ServicesTab
                            myServices={myServices}
                            addService={addService}
                            removeService={removeService}
                            mySalonId={mySalonId}
                            showToast={showToast}
                            confirmAction={confirmAction}
                        />
                    )}
                    {activeTab === 'profile' && (
                        <ProfileTab
                            mySalon={mySalon}
                            updateSalonDetails={updateSalonDetails}
                            showToast={showToast}
                        />
                    )}
                </main>
            </div>

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
            />
        </div>
    );
};