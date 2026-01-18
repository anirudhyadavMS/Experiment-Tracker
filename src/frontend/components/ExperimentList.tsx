import React from 'react';
import { Experiment, SortOptions } from '../../shared/types';
import ExperimentCard from './ExperimentCard';

interface ExperimentListProps {
  experiments: Experiment[];
  onEdit: (experiment: Experiment) => void;
  onDelete: (id: string) => void;
  onSort: (field: SortOptions['field']) => void;
  sortField?: SortOptions['field'];
  sortOrder?: 'asc' | 'desc';
}

const ExperimentList: React.FC<ExperimentListProps> = ({
  experiments,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortOrder
}) => {
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="experiment-list">
      <div className="list-header">
        <div className="header-cell name-header" onClick={() => onSort('name')}>
          Name {renderSortIcon('name')}
        </div>
        <div className="header-cell" onClick={() => onSort('owner')}>
          Owner {renderSortIcon('owner')}
        </div>
        <div className="header-cell" onClick={() => onSort('status')}>
          Status {renderSortIcon('status')}
        </div>
        <div className="header-cell" onClick={() => onSort('startDate')}>
          Start Date {renderSortIcon('startDate')}
        </div>
        <div className="header-cell" onClick={() => onSort('decision')}>
          Decision {renderSortIcon('decision')}
        </div>
        <div className="header-cell">Actions</div>
      </div>

      <div className="list-body">
        {experiments.length === 0 ? (
          <div className="no-experiments">
            <p>No experiments found</p>
            <p className="hint">Try adjusting your filters or create a new experiment</p>
          </div>
        ) : (
          experiments.map(experiment => (
            <ExperimentCard
              key={experiment._id}
              experiment={experiment}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ExperimentList;
