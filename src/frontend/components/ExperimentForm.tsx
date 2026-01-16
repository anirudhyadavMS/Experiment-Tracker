import React, { useState, useEffect } from 'react';
import { Experiment, Variant } from '../../shared/types';

interface ExperimentFormProps {
  experiment?: Experiment;
  onSubmit: (experiment: Experiment) => void;
  onCancel: () => void;
}

const ExperimentForm: React.FC<ExperimentFormProps> = ({
  experiment,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Experiment>>({
    name: '',
    description: '',
    owner: '',
    status: 'running',
    startDate: new Date().toISOString().split('T')[0],
    hypothesis: '',
    successMetrics: [''],
    targetAudience: '',
    variants: [{ name: 'Control', description: '', percentage: 50 }],
    decision: 'pending'
  });

  useEffect(() => {
    if (experiment) {
      setFormData({
        ...experiment,
        startDate: experiment.startDate ? new Date(experiment.startDate).toISOString().split('T')[0] : '',
        endDate: experiment.endDate ? new Date(experiment.endDate).toISOString().split('T')[0] : undefined
      });
    }
  }, [experiment]);

  const handleInputChange = (field: keyof Experiment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (index: number, value: string) => {
    const newMetrics = [...(formData.successMetrics || [])];
    newMetrics[index] = value;
    setFormData(prev => ({ ...prev, successMetrics: newMetrics }));
  };

  const addMetric = () => {
    setFormData(prev => ({
      ...prev,
      successMetrics: [...(prev.successMetrics || []), '']
    }));
  };

  const removeMetric = (index: number) => {
    const newMetrics = (formData.successMetrics || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, successMetrics: newMetrics }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: any) => {
    const newVariants = [...(formData.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { name: '', description: '', percentage: 0 }]
    }));
  };

  const removeVariant = (index: number) => {
    const newVariants = (formData.variants || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as Experiment);
  };

  return (
    <form onSubmit={handleSubmit} className="experiment-form">
      <h2>{experiment ? 'Edit Experiment' : 'New Experiment'}</h2>

      <div className="form-section">
        <h3>Basic Information</h3>

        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            required
            maxLength={1000}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Owner *</label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={formData.startDate as string}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              value={formData.endDate as string || ''}
              onChange={(e) => handleInputChange('endDate', e.target.value || undefined)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Hypothesis & Goals</h3>

        <div className="form-group">
          <label>Hypothesis *</label>
          <textarea
            value={formData.hypothesis}
            onChange={(e) => handleInputChange('hypothesis', e.target.value)}
            required
            maxLength={500}
            rows={3}
            placeholder="What do you expect to happen?"
          />
        </div>

        <div className="form-group">
          <label>Success Metrics *</label>
          {(formData.successMetrics || []).map((metric, index) => (
            <div key={index} className="array-input">
              <input
                type="text"
                value={metric}
                onChange={(e) => handleArrayChange(index, e.target.value)}
                placeholder="e.g., 10% increase in engagement"
                required
              />
              {index > 0 && (
                <button type="button" onClick={() => removeMetric(index)} className="btn-remove">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addMetric} className="btn-secondary">
            + Add Metric
          </button>
        </div>

        <div className="form-group">
          <label>Target Audience *</label>
          <input
            type="text"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            required
            maxLength={300}
            placeholder="Who is this experiment for?"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Variants</h3>
        {(formData.variants || []).map((variant, index) => (
          <div key={index} className="variant-group">
            <div className="variant-header">
              <h4>Variant {index + 1}</h4>
              {index > 0 && (
                <button type="button" onClick={() => removeVariant(index)} className="btn-remove">
                  Remove Variant
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  placeholder="Variant name"
                  value={variant.name}
                  onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Percentage *</label>
                <input
                  type="number"
                  placeholder="0-100"
                  value={variant.percentage}
                  onChange={(e) => handleVariantChange(index, 'percentage', Number(e.target.value))}
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <input
                type="text"
                placeholder="What makes this variant unique?"
                value={variant.description}
                onChange={(e) => handleVariantChange(index, 'description', e.target.value)}
                required
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="btn-secondary">
          + Add Variant
        </button>
      </div>

      <div className="form-section">
        <h3>Results & Outcomes</h3>

        <div className="form-group">
          <label>Results</label>
          <textarea
            value={formData.results || ''}
            onChange={(e) => handleInputChange('results', e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="What were the actual results?"
          />
        </div>

        <div className="form-group">
          <label>Learnings</label>
          <textarea
            value={formData.learnings || ''}
            onChange={(e) => handleInputChange('learnings', e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="What did you learn from this experiment?"
          />
        </div>

        <div className="form-group">
          <label>Business Impact</label>
          <textarea
            value={formData.businessImpact || ''}
            onChange={(e) => handleInputChange('businessImpact', e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="How did this impact the business?"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Confidence Level</label>
            <select
              value={formData.confidenceLevel || ''}
              onChange={(e) => handleInputChange('confidenceLevel', e.target.value || undefined)}
            >
              <option value="">Not set</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Decision</label>
            <select
              value={formData.decision}
              onChange={(e) => handleInputChange('decision', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="go">Go</option>
              <option value="no-go">No-Go</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {experiment ? 'Update' : 'Create'} Experiment
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ExperimentForm;
