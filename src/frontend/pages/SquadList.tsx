import React, { useEffect, useState } from 'react';
import { Squad } from '../../shared/types';
import { useSquads, useSquadStatistics } from '../hooks/useSquads';
import SquadCard from '../components/SquadCard';
import SquadForm from '../components/SquadForm';

const SquadList: React.FC = () => {
  const { squads, loading, error, fetchSquads, createSquad, updateSquad, deleteSquad } = useSquads();
  const { statistics, fetchStatistics } = useSquadStatistics();
  const [showForm, setShowForm] = useState(false);
  const [editingSquad, setEditingSquad] = useState<Squad | undefined>(undefined);

  useEffect(() => {
    fetchSquads();
    fetchStatistics();
  }, [fetchSquads, fetchStatistics]);

  const handleCreate = () => {
    setEditingSquad(undefined);
    setShowForm(true);
  };

  const handleEdit = (squad: Squad) => {
    setEditingSquad(squad);
    setShowForm(true);
  };

  const handleSubmit = async (squad: Squad) => {
    try {
      if (editingSquad && editingSquad._id) {
        await updateSquad(editingSquad._id, squad);
      } else {
        await createSquad(squad);
      }
      setShowForm(false);
      setEditingSquad(undefined);
      fetchStatistics(); // Refresh statistics after update
    } catch (err: any) {
      // Error handling is done in the hook
      console.error('Error submitting squad:', err);
    }
  };

  const handleDelete = async (squadId: string) => {
    try {
      await deleteSquad(squadId);
      fetchStatistics(); // Refresh statistics after delete
    } catch (err: any) {
      // Error handling is done in the hook
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSquad(undefined);
  };

  const getSquadStatistics = (squadId: string | undefined) => {
    if (!squadId) return undefined;
    return statistics.find((stat) => stat.squadId === squadId);
  };

  if (loading && squads.length === 0) {
    return <div className="loading">Loading squads...</div>;
  }

  return (
    <div className="squad-list-page">
      <div className="page-header">
        <div>
          <h1>Squads</h1>
          <p className="page-subtitle">Organize experiments by team</p>
        </div>
        <button className="btn-primary" onClick={handleCreate}>
          + Create Squad
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {squads.length === 0 && !loading ? (
        <div className="empty-state">
          <h2>No Squads Yet</h2>
          <p>Create your first squad to start organizing experiments by team.</p>
          <button className="btn-primary" onClick={handleCreate}>
            + Create First Squad
          </button>
        </div>
      ) : (
        <div className="squad-grid">
          {squads.map((squad) => (
            <SquadCard
              key={squad._id}
              squad={squad}
              statistics={getSquadStatistics(squad._id)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <SquadForm
          squad={editingSquad}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default SquadList;
