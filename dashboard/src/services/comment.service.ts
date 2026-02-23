import { api } from './api';

export const commentService = {
    getCommentsForChallenge: async (virtualId: string) => {
        const response = await api.get(`/comments/challenge/${virtualId}`);
        return response.data;
    },

    createComment: async (payload: { userId: string; comment: string; type: 'CH' | 'ID'; typeId: string }) => {
        const response = await api.post(`/comments`, payload);
        return response.data;
    }
};
