import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, ArrowRight, Menu, X, CheckCircle, MapPin, Instagram, Twitter, Facebook, Clock, User, LogOut, LayoutDashboard, Loader2, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { AuthModal } from '../components/AuthModal';
import { ClientProfileModal } from '../components/ClientProfileModal';
import { ClientBookingsModal } from '../components/ClientBookingsModal';
import { SettingsModal } from '../components/SettingsModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Role } from '../types';
import { HeroVisual } from '../components/HeroVisual';

export const LandingPage = () => {
    const { setCurrentView, login, logout, navigateToSalon, navigateToAllServices, navigateToBooking, services, salons, currentUser, bookings } = useApp();
    const { showToast } = useToast();
    const [showManagerLogin, setShowManagerLogin] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showBookingsModal, setShowBookingsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { scrollY } = useScroll();

    // Count active bookings
    const activeBookingsCount = bookings.filter(b =>
        b.customerId === currentUser?.id &&
        (b.status === 'Pending' || b.status === 'Confirmed')
    ).length;

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

    const handleLogout = () => {
        confirmAction(
            'Log Out',
            'Are you sure you want to log out?',
            async () => {
                setIsLoggingOut(true);
                await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
                logout();
                showToast('Logged out successfully', 'success');
                setIsLoggingOut(false);
                setCurrentView('LANDING');
            },
            'warning'
        );
    };

    const headerBackground = useTransform(
        scrollY,
        [0, 50],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
    );

    const headerBorder = useTransform(
        scrollY,
        [0, 50],
        ["rgba(244, 63, 94, 0)", "rgba(244, 63, 94, 0.1)"]
    );

    const headerBackdrop = useTransform(
        scrollY,
        [0, 50],
        ["blur(0px)", "blur(12px)"]
    );

    const featuredServices = services.slice(0, 4);

    const handleMainAction = () => {
        if (currentUser) {
            if (currentUser.role === Role.MANAGER) {
                setCurrentView('MANAGER_DASHBOARD');
            } else {
                setCurrentView('CUSTOMER_HOME');
            }
        } else {
            setShowRegisterModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff1f2] dark:bg-stone-900 flex flex-col font-sans selection:bg-rose-200 transition-colors duration-300">
            {/* Sticky Navbar */}
            <motion.nav
                style={{
                    backgroundColor: headerBackground,
                    borderBottomWidth: 1,
                    borderBottomColor: headerBorder,
                    backdropFilter: headerBackdrop,
                    WebkitBackdropFilter: headerBackdrop
                }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('LANDING')}>
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-rose-200 overflow-hidden">
                            <img src="/logo.png" alt="Qurux Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold text-stone-900 dark:text-white tracking-tight">Qurux</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 bg-white/50 px-6 py-2 rounded-full border border-white/50 backdrop-blur-sm shadow-sm clay-card !bg-white/40 !border-white/60">
                        <button onClick={() => setCurrentView('CUSTOMER_HOME')} className="text-stone-600 dark:text-stone-300 font-medium hover:text-rose-600 dark:hover:text-rose-400 text-sm transition-colors">Find a Salon</button>
                        <button onClick={navigateToAllServices} className="text-stone-600 dark:text-stone-300 font-medium hover:text-rose-600 dark:hover:text-rose-400 text-sm transition-colors">Services</button>
                        <button onClick={() => setCurrentView('ABOUT_US')} className="text-stone-600 dark:text-stone-300 font-medium hover:text-rose-600 dark:hover:text-rose-400 text-sm transition-colors">About Us</button>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        {!currentUser ? (
                            <>
                                <button onClick={() => setShowManagerLogin(true)} className="text-stone-500 font-medium text-sm hover:text-stone-800">
                                    Partner Registration
                                </button>
                                <Button onClick={handleMainAction} className="!py-2 !px-5 !text-sm !rounded-xl clay-button">
                                    Get Started
                                </Button>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 font-bold">
                                        {currentUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-bold text-stone-700 text-sm">{currentUser.name.split(' ')[0]}</span>
                                </button>

                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden p-2 z-50"
                                        >
                                            {currentUser.role === Role.MANAGER && (
                                                <button
                                                    onClick={() => { setCurrentView('MANAGER_DASHBOARD'); setProfileMenuOpen(false); }}
                                                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-rose-500 transition-colors flex items-center gap-2"
                                                >
                                                    <LayoutDashboard size={16} /> Dashboard
                                                </button>
                                            )}
                                            {currentUser.role === Role.CUSTOMER && (
                                                <>
                                                    <button
                                                        onClick={() => { setShowBookingsModal(true); setProfileMenuOpen(false); }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-rose-500 transition-colors flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={16} /> My Bookings
                                                        </div>
                                                        {activeBookingsCount > 0 && (
                                                            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                                                {activeBookingsCount}
                                                            </span>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowProfileModal(true); setProfileMenuOpen(false); }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-rose-500 transition-colors flex items-center gap-2"
                                                    >
                                                        <User size={16} /> Edit Profile
                                                    </button>
                                                </>
                                            )}
                                            <div className="h-px bg-stone-100 my-1" />
                                            <button
                                                onClick={() => { handleLogout(); setProfileMenuOpen(false); }}
                                                className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                                Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-stone-600 bg-white/50 rounded-lg shadow-sm">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay - Right Side Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[60] bg-stone-900/40 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 z-[70] w-64 bg-white/90 backdrop-blur-xl shadow-2xl p-6 flex flex-col gap-6 h-auto rounded-bl-3xl border-l border-white/20"
                        >
                            <div className="flex justify-end">
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-stone-400 hover:text-stone-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-6 mt-4">
                                {currentUser && (
                                    <div className="flex items-center gap-3 mb-2 p-3 bg-stone-50 rounded-2xl border border-stone-100">
                                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 font-bold text-lg">
                                            {currentUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-stone-800">{currentUser.name}</p>
                                            <p className="text-xs text-stone-500 font-medium capitalize">{currentUser.role.toLowerCase()}</p>
                                        </div>
                                    </div>
                                )}

                                <button onClick={() => { setCurrentView('CUSTOMER_HOME'); setMobileMenuOpen(false); }} className="text-left text-xl font-bold text-stone-800 hover:text-rose-500 transition-colors">Find a Salon</button>
                                <button onClick={() => { navigateToAllServices(); setMobileMenuOpen(false); }} className="text-left text-xl font-bold text-stone-800 hover:text-rose-500 transition-colors">Services</button>
                                <button onClick={() => { setCurrentView('ABOUT_US'); setMobileMenuOpen(false); }} className="text-left text-xl font-bold text-stone-800 hover:text-rose-500 transition-colors">About Us</button>

                                <div className="h-px bg-stone-200/50 my-2" />

                                {currentUser ? (
                                    <>
                                        {currentUser.role === Role.MANAGER && (
                                            <button onClick={() => { setCurrentView('MANAGER_DASHBOARD'); setMobileMenuOpen(false); }} className="text-left text-lg font-bold text-stone-600 hover:text-rose-500 transition-colors flex items-center gap-2">
                                                <LayoutDashboard size={20} /> Dashboard
                                            </button>
                                        )}
                                        {currentUser.role === Role.CUSTOMER && (
                                            <>
                                                <button onClick={() => { setShowBookingsModal(true); setMobileMenuOpen(false); }} className="text-left text-lg font-bold text-stone-600 hover:text-rose-500 transition-colors flex items-center justify-between w-full">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={20} /> My Bookings
                                                    </div>
                                                    {activeBookingsCount > 0 && (
                                                        <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            {activeBookingsCount}
                                                        </span>
                                                    )}
                                                </button>
                                                <button onClick={() => { setShowProfileModal(true); setMobileMenuOpen(false); }} className="text-left text-lg font-bold text-stone-600 hover:text-rose-500 transition-colors flex items-center gap-2">
                                                    <User size={20} /> Edit Profile
                                                </button>
                                            </>
                                        )}
                                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-left text-lg font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2">
                                            {isLoggingOut ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} />} Log Out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => { setShowManagerLogin(true); setMobileMenuOpen(false); }} className="text-left text-base font-medium text-stone-500 hover:text-stone-800">Partner Registration</button>
                                        <Button onClick={() => { handleMainAction(); setMobileMenuOpen(false); }} fullWidth className="clay-button">
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 pt-32 pb-20 px-6 flex flex-col items-center w-full max-w-7xl mx-auto">

                <HeroVisual
                    currentUser={currentUser}
                    handleMainAction={handleMainAction}
                    navigateToSalon={navigateToSalon}
                    setCurrentView={setCurrentView}
                    navigateToAllServices={navigateToAllServices}
                />

                {/* Featured Salons Section */}
                <div className="w-full max-w-7xl mx-auto mb-20">
                    <div className="flex items-end justify-between mb-8 px-4">
                        <div>
                            <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Featured Salons</h2>
                            <p className="text-stone-500 dark:text-stone-400 font-medium">Top rated beauty destinations near you.</p>
                        </div>
                        <button
                            onClick={() => setCurrentView('CUSTOMER_HOME')}
                            className="text-rose-500 font-bold text-sm hover:underline"
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {salons.slice(0, 3).map((salon, idx) => (
                            <motion.div
                                key={salon.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ y: -8 }}
                                onClick={() => navigateToSalon(salon.id)}
                                className="clay-card rounded-[32px] overflow-hidden cursor-pointer group hover:shadow-2xl hover:shadow-rose-100 dark:hover:shadow-none transition-all duration-300 border-none bg-white dark:bg-stone-800"
                            >
                                <div className="h-64 bg-stone-200 relative overflow-hidden">
                                    <img src={salon.image} alt={salon.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-bold text-stone-800 shadow-sm">
                                        <Star size={14} className="text-orange-400 fill-orange-400" /> {salon.rating}
                                    </div>
                                    {salon.city && (
                                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 text-sm font-bold text-white shadow-sm">
                                            <MapPin size={14} /> {salon.city}
                                        </div>
                                    )}

                                    {/* Social Icons Overlay - Always Visible */}
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        {salon.socialLinks?.instagram && salon.socialLinks.instagram.includes('instagram') && (
                                            <a href={salon.socialLinks.instagram} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white transition-colors shadow-sm">
                                                <Instagram size={14} />
                                            </a>
                                        )}
                                        {salon.socialLinks?.facebook && salon.socialLinks.facebook.includes('facebook') && (
                                            <a href={salon.socialLinks.facebook} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                                                <Facebook size={14} />
                                            </a>
                                        )}
                                        {salon.socialLinks?.tiktok && salon.socialLinks.tiktok.includes('tiktok') && (
                                            <a href={salon.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors shadow-sm">
                                                <span className="font-bold text-[10px]">Tk</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-stone-800 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">{salon.name}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">{salon.description}</p>

                                    <div className="flex items-center justify-end mt-4">
                                        <button className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors flex items-center gap-2">
                                            Book Now <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Top Services Section */}
                    <div className="w-full max-w-7xl mx-auto mb-20 mt-20">
                        <div className="flex items-end justify-between mb-8 px-4">
                            <div>
                                <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Top Services</h2>
                                <p className="text-stone-500 dark:text-stone-400 font-medium">Most popular treatments this week.</p>
                            </div>
                            <button
                                onClick={navigateToAllServices}
                                className="text-rose-500 font-bold text-sm hover:underline"
                            >
                                View All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.slice(0, 4).map((service, idx) => {
                                const serviceSalon = salons.find(s => s.id === service.salonId);
                                return (
                                    <motion.div
                                        key={service.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="clay-card p-6 rounded-[24px] hover:-translate-y-1 transition-transform duration-300 border-none bg-white dark:bg-stone-800 flex flex-col"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                                                <Sparkles size={20} />
                                            </div>
                                            <span className="bg-stone-100 text-stone-600 text-xs font-bold px-2 py-1 rounded-lg">
                                                ${service.price}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1 line-clamp-1">{service.nameSomali}</h3>
                                        <p className="text-stone-500 text-sm mb-3 line-clamp-1">{service.nameEnglish}</p>

                                        {serviceSalon && (
                                            <div className="flex items-center gap-1 text-xs text-stone-400 font-bold mb-4">
                                                <MapPin size={12} /> {serviceSalon.name}
                                            </div>
                                        )}

                                        <Button
                                            onClick={() => {
                                                // Navigate to booking for this service
                                                // Since we don't have direct booking link from here easily without context switch,
                                                // we can navigate to All Services or Customer Home with this service selected.
                                                // For now, let's just go to All Services which is safest.
                                                navigateToAllServices();
                                            }}
                                            className="mt-auto !py-2 !text-xs !rounded-xl clay-button w-full"
                                        >
                                            Book Now
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Client Profile Modal */}
                    <ClientProfileModal
                        isOpen={showProfileModal}
                        onClose={() => setShowProfileModal(false)}
                    />

                    {/* Client Bookings Modal */}
                    <ClientBookingsModal
                        isOpen={showBookingsModal}
                        onClose={() => setShowBookingsModal(false)}
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-400 py-16 px-6 rounded-t-[40px] mt-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-white">
                            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white overflow-hidden">
                                <img src="/logo.png" alt="Qurux Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold">Qurux</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 font-medium">
                            Empowering beauty businesses and customers with seamless technology.
                            Made with ❤️ in Somalia.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><button onClick={() => setCurrentView('ABOUT_US')} className="hover:text-white transition-colors">About</button></li>
                            <li><button onClick={() => setShowPrivacyModal(true)} className="hover:text-white transition-colors">Privacy Policy</button></li>
                            <li><button onClick={() => setShowSettingsModal(true)} className="hover:text-white transition-colors">Settings</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">For Partners</h4>
                        <p className="text-sm mb-4 font-medium">Manage your salon, track bookings, and grow your business.</p>
                        <button onClick={() => setShowManagerLogin(true)} className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-stone-700 transition-colors border border-stone-700">
                            Manager Registration
                        </button>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 flex justify-between items-center text-xs font-medium">
                    <p>&copy; {new Date().getFullYear()} Qurux Technologies.</p>
                </div>
            </footer>

            {/* Manager Login Modal */}
            <AuthModal
                isOpen={showManagerLogin}
                onClose={() => setShowManagerLogin(false)}
                onLogin={(name) => {
                    login(Role.MANAGER, name);
                    setCurrentView('MANAGER_DASHBOARD');
                    setShowManagerLogin(false);
                    showToast('Welcome to Manager Dashboard', 'success');
                }}
                title="Manager Portal"
                defaultRole={Role.MANAGER}
            />

            {/* Register/Get Started Modal */}
            <AuthModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onLogin={(name, phone) => {
                    login(Role.CUSTOMER, name);
                    setCurrentView('CUSTOMER_HOME');
                    setShowRegisterModal(false);
                    showToast(`Account created! Phone: ${phone || 'N/A'}`, 'success');
                }}
                title="Create Account"
            />

            {/* New Modals */}
            <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
            <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmation.onConfirm}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                isLoading={isLoggingOut}
                manualClose={isLoggingOut}
            />
        </div>
    );
};