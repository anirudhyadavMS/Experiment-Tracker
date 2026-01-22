import axios from 'axios';
import { Experiment, FilterCriteria, SortOptions, Squad } from '../../shared/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const experimentApi = {
  // Get all experiments with filters
  getExperiments: async (
    filters?: FilterCriteria,
    sort?: SortOptions,
    search?: string,
    page: number = 1,
    limit: number = 20
  ) => {
    try {
      const params = {
        ...filters,
        ...(sort && { sortField: sort.field, sortOrder: sort.order }),
        ...(search && { search }),
        page,
        limit,
      };

      const response = await apiClient.get('/experiments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching experiments:', error);
      throw error;
    }
  },

  // Get single experiment
  getExperimentById: async (id: string) => {
    try {
      const response = await apiClient.get(`/experiments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching experiment:', error);
      throw error;
    }
  },

  // Create new experiment
  createExperiment: async (experiment: Experiment) => {
    try {
      const response = await apiClient.post('/experiments', experiment);
      return response.data;
    } catch (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }
  },

  // Update experiment
  updateExperiment: async (id: string, experiment: Partial<Experiment>) => {
    try {
      const response = await apiClient.put(`/experiments/${id}`, experiment);
      return response.data;
    } catch (error) {
      console.error('Error updating experiment:', error);
      throw error;
    }
  },

  // Delete experiment
  deleteExperiment: async (id: string) => {
    try {
      const response = await apiClient.delete(`/experiments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting experiment:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/experiments/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },
};

export const squadApi = {
  // Get all squads
  getSquads: async () => {
    try {
      const response = await apiClient.get('/squads');
      return response.data;
    } catch (error) {
      console.error('Error fetching squads:', error);
      throw error;
    }
  },

  // Get single squad
  getSquadById: async (id: string) => {
    try {
      const response = await apiClient.get(`/squads/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching squad:', error);
      throw error;
    }
  },

  // Create new squad
  createSquad: async (squad: Squad) => {
    try {
      const response = await apiClient.post('/squads', squad);
      return response.data;
    } catch (error) {
      console.error('Error creating squad:', error);
      throw error;
    }
  },

  // Update squad
  updateSquad: async (id: string, squad: Partial<Squad>) => {
    try {
      const response = await apiClient.put(`/squads/${id}`, squad);
      return response.data;
    } catch (error) {
      console.error('Error updating squad:', error);
      throw error;
    }
  },

  // Delete squad
  deleteSquad: async (id: string) => {
    try {
      const response = await apiClient.delete(`/squads/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting squad:', error);
      throw error;
    }
  },

  // Get squad statistics
  getSquadStatistics: async () => {
    try {
      const response = await apiClient.get('/squads/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching squad statistics:', error);
      throw error;
    }
  },
};
