import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Salon, Service } from '../types';
import { useAuth } from './AuthContext';
import { salonService } from '../services/salonService';

interface SalonContextType {
    salons: Salon[];
    services: Service[];
    loading: boolean;
    addService: (service: Service) => Promise<void>;
    removeService: (id: string) => void;
    updateSalonDetails: (salon: Salon) => Promise<void>;
    createSalon: (salon: Omit<Salon, 'id' | 'rating' | 'reviewCount'>) => Promise<void>;
    addReview: (salonId: string, rating: number) => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    const [salons, setSalons] = useState<Salon[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Data on Mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [salonsData, servicesData] = await Promise.all([
                    salonService.getAllSalons(),
                    salonService.getAllServices()
                ]);
                setSalons(salonsData || []);
                setServices(servicesData || []);
            } catch (error: any) {
                console.error('Error fetching data:', error);
                // Graceful fallback for network errors
                if (error.message && error.message.includes('fetch')) {
                    console.warn('Network error: Could not reach server. Using empty data.');
                }
                setSalons([]);
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addService = async (service: Service) => {
        try {
            const newService = await salonService.addService(service);
            setServices((prev) => [...prev, newService]);
        } catch (error) {
            console.error('Error adding service:', error);
            throw error;
        }
    };

    const removeService = async (id: string) => {
        try {
            await salonService.deleteService(id);
            setServices((prev) => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Error removing service:', error);
            // Optionally show toast or revert optimistic update if we did one (but here we wait for success)
        }
    };

    const updateSalonDetails = async (updatedSalon: Salon) => {
        try {
            await salonService.updateSalon(updatedSalon);
            setSalons(prev => prev.map(s => s.id === updatedSalon.id ? updatedSalon : s));
        } catch (error) {
            console.error('Error updating salon:', error);
            throw error;
        }
    };

    const createSalon = async (salon: Omit<Salon, 'id' | 'rating' | 'reviewCount'>) => {
        try {
            const newSalon = await salonService.createSalon(salon);
            setSalons(prev => [...prev, newSalon]);
        } catch (error) {
            console.error('Error creating salon:', error);
            throw error;
        }
    };

    const addReview = async (salonId: string, rating: number) => {
        if (!currentUser) return;

        try {
            await salonService.addReview(salonId, currentUser.id, rating);

            // Optimistic Update
            setSalons(prev => prev.map(salon => {
                if (salon.id === salonId) {
                    const newCount = salon.reviewCount + 1;
                    const newRating = ((salon.rating * salon.reviewCount) + rating) / newCount;
                    return {
                        ...salon,
                        reviewCount: newCount,
                        rating: parseFloat(newRating.toFixed(1))
                    };
                }
                return salon;
            }));

        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    };

    return (
        <SalonContext.Provider value={{
            salons,
            services,
            loading,
            addService,
            removeService,
            updateSalonDetails,
            createSalon,
            addReview
        }}>
            {children}
        </SalonContext.Provider>
    );
};

export const useSalon = () => {
    const context = useContext(SalonContext);
    if (!context) {
        throw new Error('useSalon must be used within a SalonProvider');
    }
    return context;
};
