import { useState, useCallback } from 'react';
import { experimentApi } from '../services/api';
import { Experiment, FilterCriteria, SortOptions } from '../../shared/types';

export const useExperiments = () => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  const fetchExperiments = useCallback(async (
    filters?: FilterCriteria,
    sort?: SortOptions,
    search?: string,
    currentPage: number = 1
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await experimentApi.getExperiments(filters, sort, search, currentPage);
      setExperiments(response.data);
      setTotal(response.total);
      setPage(currentPage);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch experiments');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    experiments,
    loading,
    error,
    total,
    page,
    fetchExperiments,
    setExperiments
  };
};
