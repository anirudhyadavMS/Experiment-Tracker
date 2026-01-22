import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Squad, SquadStatistics } from '../../shared/types';

interface SquadCardProps {
  squad: Squad;
  statistics?: SquadStatistics;
  onEdit: (squad: Squad) => void;
  onDelete: (squadId: string) => void;
}

const SquadCard: React.FC<SquadCardProps> = ({ squad, statistics, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('.squad-card-actions')) {
      return;
    }
    navigate(`/squad/${squad._id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(squad);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (statistics && statistics.totalExperiments > 0) {
      alert(`Cannot delete squad. It has ${statistics.totalExperiments} experiment(s) assigned to it.`);
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${squad.name}?`)) {
      onDelete(squad._id!);
    }
  };

  return (
    <div className="squad-card" onClick={handleCardClick}>
      <div className="squad-card-header">
        <div className="squad-number">Squad {squad.squadNumber}</div>
        <div className="squad-card-actions">
          <button className="btn-icon" onClick={handleEdit} title="Edit squad">
            ✏️
          </button>
          <button className="btn-icon" onClick={handleDelete} title="Delete squad">
            🗑️
          </button>
        </div>
      </div>

      <h3 className="squad-name">{squad.name}</h3>

      <div className="squad-target">
        <div className="target-number">Target: {squad.targetNumber}</div>
        <div className="target-description">{squad.targetDescription}</div>
      </div>

      <div className="squad-members">
        <h4>Members ({squad.members.length})</h4>
        <ul>
          {squad.members.slice(0, 3).map((member, index) => (
            <li key={index}>
              <span className="member-name">{member.name}</span>
              <span className="member-role"> - {member.role}</span>
            </li>
          ))}
          {squad.members.length > 3 && (
            <li className="more-members">+{squad.members.length - 3} more</li>
          )}
        </ul>
      </div>

      {statistics && (
        <div className="squad-stats">
          <h4>Experiments</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{statistics.totalExperiments}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-item stat-running">
              <div className="stat-value">{statistics.runningExperiments}</div>
              <div className="stat-label">Running</div>
            </div>
            <div className="stat-item stat-completed">
              <div className="stat-value">{statistics.completedExperiments}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item stat-paused">
              <div className="stat-value">{statistics.pausedExperiments}</div>
              <div className="stat-label">Paused</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquadCard;
