import { api } from './api';
import { type User } from '../types';

export const authService = {
    login: async (email: string, password?: string) => {
        // Note: Temporary logic using password since standard AuthDto requires one,
        // though the frontend mockup currently doesn't check it directly yet.
        const response = await api.post('/auth/login', { email, password: password || 'Test@1234' });
        return response.data;
    },

    register: async (userData: Partial<User> & { name: string; email: string; interests?: string[], password?: string }) => {
        const payload = {
            name: userData.name,
            email: userData.email,
            password: userData.password || 'Test@1234',
            opco: userData.opco,
            platform: userData.platform,
            companyTechRole: userData.role || userData.companyTechRole,
            interestAreas: userData.interests || userData.interestAreas,
            role: 'USER', // Explicitly provide a default authentication role
        };

        const response = await api.post('/auth/register', payload);
        return response.data;
    },
};
