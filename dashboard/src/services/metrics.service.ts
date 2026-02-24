import { api } from './api';

export const metricsService = {
    getSummary: async () => {
        const response = await api.get('/metrics/summary');
        return response.data;
    },

    getThroughput: async () => {
        const response = await api.get('/metrics/throughput');
        return response.data;
    },

    getFunnel: async () => {
        const response = await api.get('/metrics/funnel');
        return response.data;
    },

    getTeamEngagement: async () => {
        const response = await api.get('/metrics/team-engagement');
        return response.data;
    },

    getPortfolioBalance: async () => {
        const response = await api.get('/metrics/portfolio-balance');
        return response.data;
    },

    getInnovationVelocity: async () => {
        const response = await api.get('/metrics/innovation-velocity');
        return response.data;
    },

    getOpcoRadar: async () => {
        const response = await api.get('/metrics/opco-radar');
        return response.data;
    },
};
