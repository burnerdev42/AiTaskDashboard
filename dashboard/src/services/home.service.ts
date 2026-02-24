import { api } from './api';

export const homeService = {
    getTopChallenges: async () => {
        const response = await api.get('/home/top-challenges');
        return response.data;
    },

    getStatusDistribution: async () => {
        const response = await api.get('/home/status-distribution');
        return response.data;
    },

    getKeyMetrics: async () => {
        const response = await api.get('/home/key-metrics');
        return response.data;
    },

    getChallengesByStatus: async (status: string) => {
        const response = await api.get(`/challenges/status/${status}`);
        return response.data;
    },

    getMonthlyThroughput: async () => {
        const response = await api.get('/home/monthly-throughput');
        return response.data;
    },

    getInnovationTeam: async () => {
        const response = await api.get('/home/innovation-team');
        return response.data;
    }
};
