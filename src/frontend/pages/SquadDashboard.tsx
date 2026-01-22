import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExperiments } from '../hooks/useExperiments';
import { useFilters } from '../hooks/useFilters';
import { squadApi } from '../services/api';
import ExperimentList from '../components/ExperimentList';
import ExperimentFilters from '../components/ExperimentFilters';
import ExperimentForm from '../components/ExperimentForm';
import SearchBar from '../components/SearchBar';
import { experimentApi } from '../services/api';
import { Experiment, Squad } from '../../shared/types';

const SquadDashboard: React.FC = () => {
  const { squadId } = useParams<{ squadId: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingExperiment, setEditingExperiment] = useState<Experiment | undefined>();
  const [squad, setSquad] = useState<Squad | null>(null);
  const [loadingSquad, setLoadingSquad] = useState(true);
  const { experiments, loading, error, total, page, fetchExperiments } = useExperiments();
  const { filters, sort, searchQuery, clearFilters, updateSort, setSearchQuery, setFilters } = useFilters();

  // Fetch squad details
  useEffect(() => {
    const loadSquad = async () => {
      if (!squadId) return;

      try {
        setLoadingSquad(true);
        const response = await squadApi.getSquadById(squadId);
        setSquad(response.data);
      } catch (err) {
        console.error('Failed to load squad:', err);
        alert('Failed to load squad. Redirecting to squads page.');
        navigate('/');
      } finally {
        setLoadingSquad(false);
      }
    };

    loadSquad();
  }, [squadId, navigate]);

  // Fetch experiments for this squad
  useEffect(() => {
    if (squadId) {
      const squadFilters = { ...filters, squadId };
      fetchExperiments(squadFilters, sort, searchQuery, page);
    }
  }, [squadId, filters, sort, searchQuery, page, fetchExperiments]);

  const handleCreateExperiment = async (experiment: Experiment) => {
    try {
      // Ensure the experiment is assigned to this squad
      const experimentData = { ...experiment, squadId };
      await experimentApi.createExperiment(experimentData);
      setShowForm(false);
      const squadFilters = { ...filters, squadId };
      fetchExperiments(squadFilters, sort, searchQuery, page);
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
        const squadFilters = { ...filters, squadId };
        fetchExperiments(squadFilters, sort, searchQuery, page);
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
        const squadFilters = { ...filters, squadId };
        fetchExperiments(squadFilters, sort, searchQuery, page);
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

  if (loadingSquad) {
    return <div className="loading">Loading squad...</div>;
  }

  if (!squad) {
    return <div className="error">Squad not found</div>;
  }

  return (
    <div className="squad-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="breadcrumb">
            <button onClick={() => navigate('/')} className="breadcrumb-link">
              Squads
            </button>
            <span className="breadcrumb-separator">/</span>
            <span>Squad {squad.squadNumber}</span>
          </div>
          <h1>{squad.name}</h1>
          <p className="subtitle">Manage experiments for this squad</p>
        </div>
        <div className="header-actions">
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
              defaultSquadId={squadId}
            />
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <aside className="sidebar squad-sidebar">
          <div className="squad-info-card">
            <h3>Squad Details</h3>
            <div className="squad-detail">
              <span className="label">Squad Number:</span>
              <span className="value">{squad.squadNumber}</span>
            </div>
            <div className="squad-detail">
              <span className="label">Target:</span>
              <span className="value">{squad.targetNumber} {squad.targetDescription}</span>
            </div>
            <div className="squad-detail">
              <span className="label">Members:</span>
              <ul className="members-list">
                {squad.members.map((member, index) => (
                  <li key={index}>
                    <strong>{member.name}</strong> - {member.role}
                  </li>
                ))}
              </ul>
            </div>
          </div>

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
              <button onClick={() => {
                const squadFilters = { ...filters, squadId };
                fetchExperiments(squadFilters, sort, searchQuery, page);
              }}>
                Retry
              </button>
            </div>
          )}

          {!loading && !error && experiments.length === 0 && (
            <div className="empty-state">
              <h2>No Experiments Yet</h2>
              <p>Create your first experiment for this squad.</p>
              <button
                onClick={() => {
                  setEditingExperiment(undefined);
                  setShowForm(true);
                }}
                className="btn-primary"
              >
                + New Experiment
              </button>
            </div>
          )}

          {!loading && !error && experiments.length > 0 && (
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

export default SquadDashboard;
