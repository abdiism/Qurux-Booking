import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Salon, Service } from '../types';

type AppView = 'LANDING' | 'CUSTOMER_HOME' | 'MANAGER_DASHBOARD' | 'ABOUT_US';
type CustomerSubView = 'DISCOVER' | 'SALON_DETAILS' | 'ALL_SERVICES';

interface NavigationContextType {
    currentView: AppView;
    setCurrentView: (view: AppView) => void;
    customerSubView: CustomerSubView;
    setCustomerSubView: (view: CustomerSubView) => void;
    targetSalonId: string | null;
    targetServiceId: string | null;
    navigateToSalon: (salonId: string) => void;
    navigateToAllServices: () => void;
    navigateToBooking: (service: Service, salon: Salon) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentView, setCurrentView] = useState<AppView>('LANDING');
    const [customerSubView, setCustomerSubView] = useState<CustomerSubView>('DISCOVER');
    const [targetSalonId, setTargetSalonId] = useState<string | null>(null);
    const [targetServiceId, setTargetServiceId] = useState<string | null>(null);

    const navigateToSalon = (salonId: string) => {
        setTargetSalonId(salonId);
        setCustomerSubView('SALON_DETAILS');
        setCurrentView('CUSTOMER_HOME');
        window.scrollTo(0, 0);
    };

    const navigateToAllServices = () => {
        setCustomerSubView('ALL_SERVICES');
        setCurrentView('CUSTOMER_HOME');
        window.scrollTo(0, 0);
    };

    const navigateToBooking = (service: Service, salon: Salon) => {
        setTargetSalonId(salon.id);
        setTargetServiceId(service.id);
        setCustomerSubView('SALON_DETAILS');
        setCurrentView('CUSTOMER_HOME');
        window.scrollTo(0, 0);
    };

    return (
        <NavigationContext.Provider value={{
            currentView,
            setCurrentView,
            customerSubView,
            setCustomerSubView,
            targetSalonId,
            targetServiceId,
            navigateToSalon,
            navigateToAllServices,
            navigateToBooking
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};
