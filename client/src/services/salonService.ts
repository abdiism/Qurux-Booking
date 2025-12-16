import { Salon, Service } from '../types';
import { API_URL, handleResponse, getHeaders } from './api';

export const salonService = {
    getAllSalons: async (): Promise<Salon[]> => {
        const response = await fetch(`${API_URL}/salons`);
        return handleResponse(response);
    },

    getAllServices: async (): Promise<Service[]> => {
        const response = await fetch(`${API_URL}/services`);
        return handleResponse(response);
    },

    updateSalon: async (salon: Salon): Promise<void> => {
        const response = await fetch(`${API_URL}/salons/${salon.id}`, {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(salon)
        });
        return handleResponse(response);
    },

    createSalon: async (salon: Omit<Salon, 'id' | 'rating' | 'reviewCount'>): Promise<Salon> => {
        const response = await fetch(`${API_URL}/salons`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(salon)
        });
        return handleResponse(response);
    },

    addReview: async (salonId: string, userId: string, rating: number): Promise<void> => {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify({ salonId, userId, rating })
        });
        return handleResponse(response);
    },

    addService: async (service: Service): Promise<Service> => {
        const response = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: await getHeaders(),
            body: JSON.stringify(service)
        });
        return handleResponse(response);
    },

    deleteService: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE',
            headers: await getHeaders()
        });
        return handleResponse(response);
    }
};
