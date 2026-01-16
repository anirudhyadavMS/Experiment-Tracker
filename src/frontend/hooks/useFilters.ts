import { useState } from 'react';
import { FilterCriteria, SortOptions } from '../../shared/types';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterCriteria>({});
  const [sort, setSort] = useState<SortOptions>({
    field: 'createdAt',
    order: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  const updateFilter = (key: keyof FilterCriteria, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const updateSort = (field: SortOptions['field']) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return {
    filters,
    sort,
    searchQuery,
    updateFilter,
    clearFilters,
    updateSort,
    setSearchQuery,
    setFilters,
    setSort
  };
};
