import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking } from '../types';
import { supabase } from '../lib/supabase';
import { bookingService } from '../services/bookingService';

interface BookingContextType {
    bookings: Booking[];
    addBooking: (booking: Booking) => Promise<void>;
    updateBookingStatus: (id: string, status: 'Confirmed' | 'Pending' | 'Completed' | 'Declined') => Promise<void>;
    cancelBooking: (id: string) => Promise<void>;
    refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

import { useAuth } from './AuthContext';

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const { currentUser } = useAuth();

    const fetchBookings = async () => {
        if (!currentUser) {
            console.log('BookingContext: No currentUser, clearing bookings');
            setBookings([]);
            return;
        }

        try {
            console.log('BookingContext: Fetching bookings for user:', currentUser.id, 'Role:', currentUser.role);
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) return;

            const fetchedBookings = await bookingService.getBookings(token, currentUser.role, currentUser.id);

            // Convert date strings to Date objects if needed, but types say Date | string.
            // Let's ensure consistency. Service returns JSON strings.
            // We might need to map them back to Date objects if the app expects Date objects.
            // The Booking type has `date: Date`.
            const mappedBookings = fetchedBookings.map(b => ({
                ...b,
                date: new Date(b.date)
            }));

            setBookings(mappedBookings);
        } catch (error: any) {
            console.error('Error fetching bookings:', error);
            if (error.message && error.message.includes('fetch')) {
                console.warn('Network error: Could not reach server. Bookings list might be empty.');
            }
            setBookings([]);
        }
    };

    // Fetch on mount and when user changes
    React.useEffect(() => {
        fetchBookings();
    }, [currentUser]);

    const addBooking = async (booking: Booking) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (!token) throw new Error('Missing Authorization');

            await bookingService.createBooking(booking, token);

            // Refresh list from server to get the real ID and data
            await fetchBookings();

        } catch (error) {
            console.error('Booking Error:', error);
            throw error;
        }
    };

    const updateBookingStatus = async (id: string, status: any) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error('Missing Authorization');

            await bookingService.updateBookingStatus(id, status, token);
            await fetchBookings();
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    const cancelBooking = async (id: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error('Missing Authorization');

            await bookingService.cancelBooking(id, token);
            await fetchBookings();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw error;
        }
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, cancelBooking, refreshBookings: fetchBookings }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
};
