import { Booking } from '../types';
import { API_URL, handleResponse, getHeaders } from './api';

export const bookingService = {
    createBooking: async (booking: Booking, token: string): Promise<Booking> => {
        const headers = await getHeaders(token);
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                customerId: booking.customerId,
                salonId: booking.salonId,
                serviceId: booking.serviceId,
                date: booking.date.toISOString(),
                timeSlot: booking.timeSlot,
                totalPrice: booking.totalPrice,
                paymentMethod: booking.paymentMethod,
                customerName: booking.customerName
            })
        });
        return handleResponse(response);
    },
    getBookings: async (token: string, role: string, userId: string): Promise<Booking[]> => {
        const headers = await getHeaders(token);
        const response = await fetch(`${API_URL}/bookings?role=${role}&userId=${userId}`, {
            headers
        });
        return handleResponse(response);
    },
    cancelBooking: async (id: string, token: string): Promise<any> => {
        const headers = await getHeaders(token);
        const response = await fetch(`${API_URL}/bookings/${id}/cancel`, {
            method: 'PUT',
            headers
        });
        return handleResponse(response);
    },
    updateBookingStatus: async (id: string, status: string, token: string): Promise<any> => {
        const headers = await getHeaders(token);
        const response = await fetch(`${API_URL}/bookings/${id}/status`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    }
};
