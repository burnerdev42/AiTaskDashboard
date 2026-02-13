import { useState } from 'react';
import type { PaginationParams } from '../types/filterPaginationSort';

export function usePagination(initialSize = 10) {
    const [params, setParams] = useState<PaginationParams>({ page: 0, size: initialSize });

    const nextPage = () => setParams(p => ({ ...p, page: (p.page || 0) + 1 }));
    const prevPage = () => setParams(p => ({ ...p, page: Math.max(0, (p.page || 0) - 1) }));
    const setPage = (page: number) => setParams(p => ({ ...p, page }));
    const setSize = (size: number) => setParams(p => ({ ...p, size, page: 0 }));

    return { params, nextPage, prevPage, setPage, setSize, setParams };
}
