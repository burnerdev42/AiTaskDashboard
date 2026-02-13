import { useState, useEffect, useCallback } from 'react';
import { profileRepository } from '../api/profileRepository';
import type { UserProfileData } from '../../../types/user';
import { ApiError } from '../../../utils/ApiError';

interface UseProfileResult {
    data: UserProfileData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useProfile = (): UseProfileResult => {
    const [data, setData] = useState<UserProfileData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await profileRepository.getUserProfile();
            setData(result);
        } catch (err: unknown) {
            const message = err instanceof ApiError
                ? err.userMessage
                : (err instanceof Error ? err.message : 'An unexpected error occurred');

            setError(message);
            console.error('Failed to fetch profile:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};
