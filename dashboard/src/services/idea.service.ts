import { api } from './api';

export const ideaService = {
    getIdeasForChallenge: async (virtualId: string) => {
        // Note: If this endpoint doesn't exist on the backend yet, we'll try to use a filter on /ideas
        const response = await api.get(`/ideas/challenge/${virtualId}`);
        return response.data;
    },

    getIdeaById: async (virtualId: string) => {
        const response = await api.get(`/ideas/${virtualId}`);
        return response.data;
    },

    recordView: async (ideaId: string) => {
        const response = await api.post(`/ideas/${ideaId}/view`);
        return response.data;
    },

    toggleUpvote: async (virtualId: string, userId: string) => {
        const response = await api.post(`/ideas/${virtualId}/upvote`, { userId });
        return response.data;
    },

    toggleSubscribe: async (virtualId: string, userId: string) => {
        const response = await api.post(`/ideas/${virtualId}/subscribe`, { userId });
        return response.data;
    }
};
