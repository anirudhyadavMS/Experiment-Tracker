import { useState, useCallback } from 'react';
import { squadApi } from '../services/api';
import { Squad, SquadStatistics } from '../../shared/types';

export const useSquads = () => {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSquads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await squadApi.getSquads();
      setSquads(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch squads');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSquad = useCallback(async (squad: Squad) => {
    setLoading(true);
    setError(null);

    try {
      const response = await squadApi.createSquad(squad);
      setSquads((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to create squad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSquad = useCallback(async (id: string, squad: Partial<Squad>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await squadApi.updateSquad(id, squad);
      setSquads((prev) =>
        prev.map((s) => (s._id === id ? response.data : s))
      );
      return response.data;
    } catch (err: any) {
      setError(err.message || 'Failed to update squad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSquad = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await squadApi.deleteSquad(id);
      setSquads((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete squad');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    squads,
    loading,
    error,
    fetchSquads,
    createSquad,
    updateSquad,
    deleteSquad,
    setSquads
  };
};

export const useSquadStatistics = () => {
  const [statistics, setStatistics] = useState<SquadStatistics[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await squadApi.getSquadStatistics();
      setStatistics(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch squad statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    statistics,
    loading,
    error,
    fetchStatistics
  };
};
