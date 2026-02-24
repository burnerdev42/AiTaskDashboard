import { api } from './api';
import { COMMENT_TYPES } from '../constants/app-constants';

export const commentService = {
    getCommentsForChallenge: async (virtualId: string) => {
        const response = await api.get(`/comments/challenge/${virtualId}`);
        return response.data;
    },

    createComment: async (payload: { userId: string; comment: string; type: typeof COMMENT_TYPES[keyof typeof COMMENT_TYPES]; parentId: string }) => {
        const response = await api.post(`/comments`, payload);
        return response.data;
    }
};
