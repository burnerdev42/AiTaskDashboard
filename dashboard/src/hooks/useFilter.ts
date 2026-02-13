import { useState } from 'react';
import type { FilterRequest } from '../types/filterPaginationSort';

export function useFilter<T extends FilterRequest>(initialFilter: T) {
    const [filter, setFilter] = useState<T>(initialFilter);

    const updateFilter = (newFilter: Partial<T>) => {
        setFilter(prev => ({ ...prev, ...newFilter }));
    };

    const resetFilter = () => setFilter(initialFilter);

    return { filter, updateFilter, resetFilter, setFilter };
}
