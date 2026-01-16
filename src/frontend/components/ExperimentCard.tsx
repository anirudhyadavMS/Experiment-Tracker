import React from 'react';
import { Experiment } from '../../shared/types';

interface ExperimentCardProps {
  experiment: Experiment;
  onEdit: (experiment: Experiment) => void;
  onDelete: (id: string) => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onEdit,
  onDelete
}) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'running': return 'status-running';
      case 'completed': return 'status-completed';
      case 'paused': return 'status-paused';
      default: return '';
    }
  };

  const getDecisionClass = (decision?: string) => {
    switch (decision) {
      case 'go': return 'decision-go';
      case 'no-go': return 'decision-no-go';
      case 'pending': return 'decision-pending';
      default: return '';
    }
  };

  return (
    <div className="experiment-card">
      <div className="card-cell name-cell">
        <strong>{experiment.name}</strong>
        <p className="description">{experiment.description}</p>
      </div>
      <div className="card-cell">{experiment.owner}</div>
      <div className="card-cell">
        <span className={`status-badge ${getStatusClass(experiment.status)}`}>
          {experiment.status}
        </span>
      </div>
      <div className="card-cell">{formatDate(experiment.startDate)}</div>
      <div className="card-cell">
        <span className={`decision-badge ${getDecisionClass(experiment.decision)}`}>
          {experiment.decision || 'pending'}
        </span>
      </div>
      <div className="card-cell actions-cell">
        <button
          onClick={() => onEdit(experiment)}
          className="btn-edit"
          title="Edit experiment"
        >
          Edit
        </button>
        <button
          onClick={() => experiment._id && onDelete(experiment._id)}
          className="btn-delete"
          title="Delete experiment"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExperimentCard;
