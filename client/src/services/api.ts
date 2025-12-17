import { supabase } from '../lib/supabase';

// Dynamically determine API URL based on environment OR use proxy
export const API_URL = import.meta.env.VITE_API_URL || '/api';

export const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Request failed');
    }
    return response.json();
};

export const getHeaders = async (token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }
    }
    return headers;
};

export const getAvailability = async (salonId: string, date: Date) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/bookings/availability?salonId=${salonId}&date=${date.toISOString()}`, {
        headers
    });
    return handleResponse(response);
};

export const createBooking = async (bookingData: any) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bookingData)
    });
    return handleResponse(response);
};
