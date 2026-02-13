import { useState, useCallback } from 'react';
import { ApiError } from '../utils/ApiError';
import type { PagedResponse } from '../types';
import type { PaginationParams } from '../types/filterPaginationSort';

export function useEntityList<T>(
    fetchFn: (params?: PaginationParams) => Promise<PagedResponse<T>>
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<ApiError | null>(null);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [pagination, setPagination] = useState<PaginationParams>({ page: 0, size: 10 });

    const fetch = useCallback(async (params?: PaginationParams) => {
        setLoading(true);
        setError(null);
        try {
            const mergedParams = { ...pagination, ...params };
            const result = await fetchFn(mergedParams);
            setData(result.content);
            setTotalRecords(result.totalElements);
            setPagination(mergedParams);
        } catch (err: unknown) {
            const apiError = err instanceof ApiError ? err : new ApiError({
                message: (err as Error).message || 'Unknown error',
                status: 500,
                code: 'UNKNOWN_ERROR',
                userMessage: 'Failed to fetch data',
                data: err
            });
            setError(apiError);
        } finally {
            setLoading(false);
        }
    }, [fetchFn, pagination]);

    const setPage = (page: number) => fetch({ ...pagination, page });
    const setSize = (size: number) => fetch({ ...pagination, size, page: 0 }); // Reset to page 0 on size change

    return {
        data,
        loading,
        error,
        totalRecords,
        pagination,
        fetch,
        setPage,
        setSize
    };
}
