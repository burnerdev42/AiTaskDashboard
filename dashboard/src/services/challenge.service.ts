import { api } from './api';

export const challengeService = {
  getChallenges: async (limit = 20, offset = 0) => {
    const response = await api.get(`/challenges?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  getChallengeById: async (virtualId: string) => {
    const response = await api.get(`/challenges/${virtualId}`);
    return response.data;
  },

  updateChallengeStatus: async (virtualId: string, status: string, userId: string) => {
    const response = await api.patch(`/challenges/${virtualId}/status`, { status, userId });
    return response.data;
  },
};
