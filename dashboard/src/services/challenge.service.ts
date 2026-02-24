import { api } from './api';

export const challengeService = {
  getChallenges: async (limit = 20, offset = 0) => {
    const response = await api.get(`/challenges?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createChallenge: async (data: any) => {
    const response = await api.post(`/challenges`, data);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateChallenge: async (virtualId: string, data: any) => {
    const response = await api.put(`/challenges/${virtualId}`, data);
    return response.data;
  },

  deleteChallenge: async (virtualId: string) => {
    const response = await api.delete(`/challenges/${virtualId}`);
    return response.data;
  },

  toggleUpvote: async (virtualId: string, userId: string) => {
    const response = await api.post(`/challenges/${virtualId}/upvote`, { userId });
    return response.data;
  },

  toggleSubscribe: async (virtualId: string, userId: string) => {
    const response = await api.post(`/challenges/${virtualId}/subscribe`, { userId });
    return response.data;
  },

  recordView: async (virtualId: string) => {
    const response = await api.post(`/challenges/${virtualId}/view`);
    return response.data;
  }
};
