import React, { useState, useEffect } from 'react';
import { useExperiments } from '../hooks/useExperiments';
import { useFilters } from '../hooks/useFilters';
import ExperimentList from '../components/ExperimentList';
import ExperimentFilters from '../components/ExperimentFilters';
import ExperimentForm from '../components/ExperimentForm';
import SearchBar from '../components/SearchBar';
import { experimentApi } from '../services/api';
import { Experiment } from '../../shared/types';

const Dashboard: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | undefined>();
  const { experiments, loading, error, total, page, fetchExperiments } = useExperiments();
  const { filters, sort, searchQuery, clearFilters, updateSort, setSearchQuery, setFilters } = useFilters();

  useEffect(() => {
    fetchExperiments(filters, sort, searchQuery, page);
  }, [filters, sort, searchQuery, page, fetchExperiments]);

  const handleCreateExperiment = async (experiment: Experiment) => {
    try {
      await experimentApi.createExperiment(experiment);
      setShowForm(false);
      fetchExperiments(filters, sort, searchQuery, page);
    } catch (error) {
      console.error('Failed to create experiment:', error);
      alert('Failed to create experiment. Please try again.');
    }
  };

  const handleUpdateExperiment = async (experiment: Experiment) => {
    try {
      if (experiment._id) {
        await experimentApi.updateExperiment(experiment._id, experiment);
        setShowForm(false);
        setEditingExperiment(undefined);
        fetchExperiments(filters, sort, searchQuery, page);
      }
    } catch (error) {
      console.error('Failed to update experiment:', error);
      alert('Failed to update experiment. Please try again.');
    }
  };

  const handleDeleteExperiment = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experiment? This action cannot be undone.')) {
      try {
        await experimentApi.deleteExperiment(id);
        fetchExperiments(filters, sort, searchQuery, page);
      } catch (error) {
        console.error('Failed to delete experiment:', error);
        alert('Failed to delete experiment. Please try again.');
      }
    }
  };

  const handleEdit = (experiment: Experiment) => {
    setEditingExperiment(experiment);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExperiment(undefined);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleExportPowerPoint = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/export/powerpoint`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `experiments_${new Date().toISOString().split('T')[0]}.pptx`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export to PowerPoint:', error);
      alert('Failed to export experiments to PowerPoint. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Product Feature Experiments</h1>
          <p className="subtitle">Track and manage your product experiments</p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleExportPowerPoint}
            className="btn-secondary btn-export"
            disabled={experiments.length === 0}
          >
            📊 Export to PPT
          </button>
          <button
            onClick={() => {
              setEditingExperiment(undefined);
              setShowForm(true);
            }}
            className="btn-primary btn-new"
          >
            + New Experiment
          </button>
        </div>
      </header>

      {showForm && (
        <div className="modal-overlay" onClick={handleFormCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ExperimentForm
              experiment={editingExperiment}
              onSubmit={editingExperiment ? handleUpdateExperiment : handleCreateExperiment}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <aside className="sidebar">
          <ExperimentFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </aside>

        <main className="main-content">
          <div className="controls">
            <SearchBar onSearch={handleSearch} />
            <div className="results-info">
              Showing {experiments.length} of {total} experiments
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading experiments...</p>
            </div>
          )}

          {error && (
            <div className="error">
              <p>Error: {error}</p>
              <button onClick={() => fetchExperiments(filters, sort, searchQuery, page)}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <ExperimentList
              experiments={experiments}
              onEdit={handleEdit}
              onDelete={handleDeleteExperiment}
              onSort={updateSort}
              sortField={sort.field}
              sortOrder={sort.order}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
