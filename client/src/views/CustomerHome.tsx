import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, Search, User, Settings, Shield, LogOut, Sparkles, Loader, Calendar } from 'lucide-react';
import { Service, PaymentMethod, Role, Salon } from '../types';
import { Button } from '../components/Button';
import { AuthModal } from '../components/AuthModal';
import { ClientProfileModal } from '../components/ClientProfileModal';
import { ClientBookingsModal } from '../components/ClientBookingsModal';
import { SettingsModal } from '../components/SettingsModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';
import { AboutUsModal } from '../components/AboutUsModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { SalonsList } from '../components/customer/SalonsList';
import { ServicesList } from '../components/customer/ServicesList';
import { BookingSchedule } from '../components/customer/BookingSchedule';
import { PaymentForm } from '../components/customer/PaymentForm';
import { BookingSuccess } from '../components/customer/BookingSuccess';

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

// Footer Component
interface FooterProps {
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenSettings: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenAbout, onOpenPrivacy, onOpenSettings }) => (
  <footer className="bg-stone-900 text-stone-400 py-16 px-6 rounded-t-[40px] mt-20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      <div>
        <div className="flex items-center gap-2 mb-6 text-white">
          <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white overflow-hidden">
            <img src="/logo.png" alt="Qurux Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold">Qurux</span>
        </div>
        <p className="text-sm leading-relaxed mb-6">
          Empowering beauty businesses and customers with seamless technology.
          Made with ❤️ in Somalia.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Company</h4>
        <ul className="space-y-3 text-sm font-medium">
          <li><button onClick={onOpenAbout} className="hover:text-white transition-colors">About</button></li>
          <li><button onClick={onOpenPrivacy} className="hover:text-white transition-colors">Privacy Policy</button></li>
          <li><button onClick={onOpenSettings} className="hover:text-white transition-colors">Settings</button></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Mobile App</h4>
        <p className="text-sm mb-4">Coming soon to iOS and Android.</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
      <p>&copy; {new Date().getFullYear()} Qurux Technologies.</p>
    </div>
  </footer>
);

export const CustomerHome = () => {
  const {
    services, salons, addBooking, currentUser, login, logout, bookings,
    customerSubView, setCustomerSubView, targetSalonId, targetServiceId, setCurrentView
  } = useApp();
  const { showToast } = useToast();

  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [step, setStep] = useState<'salons' | 'services' | 'schedule' | 'payment' | 'success'>('salons');

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Count active bookings
  const activeBookingsCount = bookings.filter(b =>
    b.customerId === currentUser?.id &&
    (b.status === 'Pending' || b.status === 'Confirmed')
  ).length;

  // Confirmation Modal State
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

  // Booking State
  const [bookingDate, setBookingDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [multiSlotMode, setMultiSlotMode] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // Fetch Availability
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedSalon) return;
      try {
        // Import dynamically or assume it's imported at top. 
        // I will add import at top in next step or use require if needed, but better to add import.
        // For now, I'll add the logic here and assumes import exists.
        // Wait, I can't assume. I must add import.
        const { getAvailability } = await import('../services/api');
        const slots = await getAvailability(selectedSalon.id, bookingDate);
        setBookedSlots(slots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        // showToast('Could not check availability', 'error');
      }
    };
    fetchAvailability();
  }, [selectedSalon, bookingDate]);

  // Computed Price
  const totalPrice = selectedService
    ? selectedService.price * (selectedSlots.length || 1)
    : 0;

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Filter Salons
  const filteredSalons = salons.filter(salon => {
    const query = searchQuery.toLowerCase();
    return (
      salon.name.toLowerCase().includes(query) ||
      (salon.city && salon.city.toLowerCase().includes(query)) ||
      // Search by service name (requires checking services for this salon)
      services.some(s =>
        s.salonId === salon.id &&
        (s.nameSomali.toLowerCase().includes(query) || s.nameEnglish.toLowerCase().includes(query))
      )
    );
  });

  // Handle Deep Linking / View Mode Changes
  useEffect(() => {
    if (customerSubView === 'ALL_SERVICES') {
      setStep('services');
      setSelectedSalon(null);
      window.scrollTo(0, 0);
    } else if (customerSubView === 'SALON_DETAILS' && targetSalonId) {
      const salon = salons.find(s => s.id === targetSalonId);
      if (salon) {
        setSelectedSalon(salon);
        setStep('services');
        if (targetServiceId) {
          const service = services.find(s => s.id === targetServiceId);
          if (service) {
            setSelectedService(service);
            setStep('schedule');
          }
        }
      }
      window.scrollTo(0, 0);
    } else {
      setStep('salons');
    }
  }, [customerSubView, targetSalonId, targetServiceId, salons, services]);

  // Navbar Scroll Effect
  const { scrollY } = useScroll();
  const headerBackground = useTransform(scrollY, [0, 50], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]);
  const headerBackdrop = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  // Actions
  const handleSalonSelect = (salon: Salon) => {
    setSelectedSalon(salon);
    setStep('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    // Reset booking state
    setSelectedSlots([]);
    setMultiSlotMode(false);

    if (!selectedSalon) {
      const salon = salons.find(s => s.id === service.salonId);
      if (salon) setSelectedSalon(salon);
    }

    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setStep('schedule');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAuthSuccess = (name: string, phone?: string) => {
    login(Role.CUSTOMER, name);
    setShowAuthModal(false);
    if (phone) {
      showToast(`Welcome ${name}! Your phone ${phone} is registered.`, 'success');
    } else {
      showToast(`Welcome back, ${name}!`, 'success');
    }

    if (selectedService) {
      setStep('schedule');
    }
  };

  const handleConfirmBooking = () => {
    if (selectedService && selectedSlots.length > 0 && paymentMethod && currentUser && selectedSalon) {
      addBooking({
        id: Math.random().toString(36).substr(2, 9),
        serviceId: selectedService.id,
        salonId: selectedSalon.id,
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerPhone: currentUser.phoneNumber,
        date: bookingDate,
        timeSlot: selectedSlots.join(', '), // Store formatted string
        paymentMethod: paymentMethod,
        status: 'Pending',
        totalPrice: totalPrice
      });
      setStep('success');
      showToast('Booking Confirmed!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    confirmAction(
      'Log Out',
      'Are you sure you want to log out?',
      async () => {
        setIsLoggingOut(true);
        // Simulate a small delay for the spinner effect if logout is too fast
        await new Promise(resolve => setTimeout(resolve, 800));
        await logout();
        showToast('Logged out successfully', 'info');
        setConfirmation(prev => ({ ...prev, isOpen: false })); // Close modal
        setCurrentView('LANDING');
        setIsLoggingOut(false);
      },
      'warning'
    );
  };

  const handleBack = () => {
    if (step === 'schedule') setStep('services');
    else if (step === 'payment') setStep('schedule');
    else if (step === 'success') {
      setStep('salons');
      setCustomerSubView('DISCOVER');
      setSelectedService(null);
      setSelectedSalon(null);
    }
    else if (step === 'services') {
      setCustomerSubView('DISCOVER');
      setStep('salons');
      setSelectedSalon(null);
    } else {
      setCurrentView('LANDING');
    }
  };

  return (
    <div className="min-h-screen bg-[#fff1f2] dark:bg-stone-900 font-sans selection:bg-rose-200 flex flex-col transition-colors duration-300">

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleAuthSuccess}
      />
      <ClientProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <ClientBookingsModal
        isOpen={showBookingsModal}
        onClose={() => setShowBookingsModal(false)}
      />
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        title={confirmation.title}
        message={confirmation.message}
        onConfirm={confirmation.onConfirm}
        onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
        type={confirmation.type}
        isLoading={isLoggingOut}
        manualClose={isLoggingOut}
      />

      {/* Sticky Navbar */}
      <motion.header
        style={{
          backgroundColor: headerBackground,
          backdropFilter: headerBackdrop,
          WebkitBackdropFilter: headerBackdrop
        }}
        className="fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-stone-600 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-stone-100/50"
            >
              <ChevronLeft size={20} />
            </button>

            <h1 className="font-bold text-stone-900 dark:text-white text-lg tracking-tight truncate max-w-[200px]">
              {step === 'salons' ? 'Discover' :
                step === 'services' && !selectedSalon ? 'All Services' :
                  selectedSalon?.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {(step === 'salons' || (!selectedSalon && step === 'services')) && (
              <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search salons, cities..."
                  className="pl-10 pr-4 py-2 bg-white/50 dark:bg-stone-800/50 border border-stone-100/50 dark:border-stone-700/50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 dark:text-white w-64 transition-all"
                />
              </div>
            )}
            {/* Mobile Search Icon (toggles input - simplified for now just show input on mobile too or keep hidden) */}
            {(step === 'salons' || (!selectedSalon && step === 'services')) && (
              <div className="md:hidden">
                {/* Mobile search could be a modal or expand, for now let's just show a small icon that focuses an input? 
                     Or better, put the search bar in the main content area for mobile. 
                     Let's add a search bar in the main content area for mobile.
                 */}
              </div>
            )}

            {currentUser ? (
              <div className="relative">
                <div
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 bg-white/50 pl-1 pr-3 py-1 rounded-full border border-stone-100/50 cursor-pointer hover:bg-white transition-all shadow-sm"
                >
                  <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-200">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-300 hidden sm:block">{currentUser.name.split(' ')[0]}</span>
                </div>
                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 p-2 flex flex-col gap-1 z-[60]"
                    >
                      <button
                        type="button"
                        onClick={() => { setShowBookingsModal(true); setShowProfileMenu(false); }}
                        className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar size={14} /> My Bookings
                        </div>
                        {activeBookingsCount > 0 && (
                          <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {activeBookingsCount}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg font-medium"
                      >
                        <User size={14} /> Edit Profile
                      </button>
                      <button
                        onClick={() => { setShowSettingsModal(true); setShowProfileMenu(false); }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg font-medium"
                      >
                        <Settings size={14} /> Settings
                      </button>
                      <button
                        onClick={() => { setShowPrivacyModal(true); setShowProfileMenu(false); }}
                        className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg font-medium"
                      >
                        <Shield size={14} /> Privacy Policy
                      </button>
                      <div className="h-px bg-stone-100 my-1" />
                      <button type="button" onClick={(e) => {
                        e.stopPropagation(); // Stop bubbling
                        // Debug log 
                        console.log('Logout clicked');
                        // Call logout directly first to test, then modal
                        handleLogout();
                        setShowProfileMenu(false);
                      }} disabled={isLoggingOut} className="touch-manipulation cursor-pointer flex items-center gap-2 w-full text-left px-3 py-3 sm:py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-bold disabled:opacity-50">
                        {isLoggingOut ? <Loader size={14} className="animate-spin" /> : <LogOut size={14} />}
                        {isLoggingOut ? 'Logging Out...' : 'Log Out'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button onClick={() => setShowAuthModal(true)} className="!py-2 !px-4 !text-sm !rounded-xl">
                Log In
              </Button>
            )}
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-32 px-6 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait">

          {/* STEP 1: SALONS LIST */}
          {step === 'salons' && (
            <SalonsList
              salons={filteredSalons}
              onSalonSelect={handleSalonSelect}
            />
          )}

          {/* STEP 2: SERVICES LIST */}
          {step === 'services' && (
            <ServicesList
              selectedSalon={selectedSalon}
              services={services}
              salons={salons}
              onServiceSelect={handleServiceSelect}
              formatPrice={formatPrice}
              onSalonClick={handleSalonSelect}
              searchQuery={searchQuery}
            />
          )}

          {/* STEP 3: SCHEDULE */}
          {step === 'schedule' && selectedService && (
            <BookingSchedule
              selectedService={selectedService}
              bookingDate={bookingDate}
              setBookingDate={setBookingDate}
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
              multiSlotMode={multiSlotMode}
              setMultiSlotMode={setMultiSlotMode}
              totalPrice={totalPrice}
              formatPrice={formatPrice}
              onNext={() => setStep('payment')}
              bookedSlots={bookedSlots}
            />
          )}

          {/* STEP 4: PAYMENT */}
          {step === 'payment' && (
            <PaymentForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onConfirm={handleConfirmBooking}
            />
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'success' && (
            <BookingSuccess
              selectedService={selectedService}
              selectedSalon={selectedSalon}
              bookingDate={bookingDate}
              selectedSlots={selectedSlots}
              paymentMethod={paymentMethod}
              totalPrice={totalPrice}
              formatPrice={formatPrice}
              onBackToHome={() => {
                setStep('salons');
                setSelectedService(null);
                setSelectedSalon(null);
                setSelectedSlots([]);
                setPaymentMethod('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Shared Footer */}
      <Footer
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      {/* New Modals */}
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <AboutUsModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
    </div>
  );
};