import React, { useState } from 'react';
import { FilterCriteria } from '../../shared/types';

interface ExperimentFiltersProps {
  filters: FilterCriteria;
  onFilterChange: (filters: FilterCriteria) => void;
  onClearFilters: () => void;
}

const ExperimentFilters: React.FC<ExperimentFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

  const handleInputChange = (field: keyof FilterCriteria, value: any) => {
    setLocalFilters(prev => ({ ...prev, [field]: value || undefined }));
  };

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  return (
    <div className="experiment-filters">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Status:</label>
        <select
          value={localFilters.status || ''}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="">All</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Owner:</label>
        <input
          type="text"
          value={localFilters.owner || ''}
          onChange={(e) => handleInputChange('owner', e.target.value)}
          placeholder="Filter by owner"
        />
      </div>

      <div className="filter-group">
        <label>Start Date From:</label>
        <input
          type="date"
          value={localFilters.startDateFrom as string || ''}
          onChange={(e) => handleInputChange('startDateFrom', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Start Date To:</label>
        <input
          type="date"
          value={localFilters.startDateTo as string || ''}
          onChange={(e) => handleInputChange('startDateTo', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Decision:</label>
        <select
          value={localFilters.decision || ''}
          onChange={(e) => handleInputChange('decision', e.target.value)}
        >
          <option value="">All</option>
          <option value="go">Go</option>
          <option value="no-go">No-Go</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Confidence Level:</label>
        <select
          value={localFilters.confidenceLevel || ''}
          onChange={(e) => handleInputChange('confidenceLevel', e.target.value)}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="filter-actions">
        <button onClick={handleApply} className="btn-primary">Apply Filters</button>
        <button onClick={onClearFilters} className="btn-secondary">Clear</button>
      </div>
    </div>
  );
};

export default ExperimentFilters;
