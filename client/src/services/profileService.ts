import { API_URL, handleResponse, getHeaders } from './api';

export const profileService = {
    getProfile: async (userId: string) => {
        const response = await fetch(`${API_URL}/profiles/${userId}`);
        if (!response.ok) return null; // Handle 404 gracefully
        return handleResponse(response);
    },

    updateProfile: async (userId: string, data: { full_name?: string; phone_number?: string; location?: string }) => {
        const response = await fetch(`${API_URL}/profiles/${userId}`, {
            method: 'PUT',
            headers: await getHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};
