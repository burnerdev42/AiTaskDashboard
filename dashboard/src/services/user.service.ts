import { api } from './api';
import { type User } from '../types';

export const userService = {
    getUserById: async (id: string): Promise<User> => {
        const response = await api.get(`/users/${id}`);
        // Transform the NestJS success response pattern
        return response.data.data.user;
    },
};
