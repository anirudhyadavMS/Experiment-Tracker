import React, { useState, useEffect } from 'react';
import { Squad, SquadMember } from '../../shared/types';

interface SquadFormProps {
  squad?: Squad;
  onSubmit: (squad: Squad) => Promise<void>;
  onCancel: () => void;
}

const SquadForm: React.FC<SquadFormProps> = ({ squad, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Squad>({
    squadNumber: squad?.squadNumber || 0,
    name: squad?.name || '',
    members: squad?.members || [{ name: '', role: '' }],
    targetNumber: squad?.targetNumber || 0,
    targetDescription: squad?.targetDescription || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (squad) {
      setFormData({
        squadNumber: squad.squadNumber,
        name: squad.name,
        members: squad.members.length > 0 ? squad.members : [{ name: '', role: '' }],
        targetNumber: squad.targetNumber,
        targetDescription: squad.targetDescription,
      });
    }
  }, [squad]);

  const handleChange = (field: keyof Squad, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index: number, field: keyof SquadMember, value: string) => {
    const updatedMembers = [...formData.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setFormData((prev) => ({ ...prev, members: updatedMembers }));
  };

  const addMember = () => {
    setFormData((prev) => ({
      ...prev,
      members: [...prev.members, { name: '', role: '' }],
    }));
  };

  const removeMember = (index: number) => {
    if (formData.members.length === 1) {
      return; // Keep at least one member
    }
    const updatedMembers = formData.members.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, members: updatedMembers }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Squad name is required');
      return;
    }

    if (formData.squadNumber < 1) {
      setError('Squad number must be at least 1');
      return;
    }

    if (formData.targetNumber < 0) {
      setError('Target number cannot be negative');
      return;
    }

    if (!formData.targetDescription.trim()) {
      setError('Target description is required');
      return;
    }

    // Filter out empty members
    const validMembers = formData.members.filter(
      (m) => m.name.trim() && m.role.trim()
    );

    if (validMembers.length === 0) {
      setError('At least one valid member is required');
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({ ...formData, members: validMembers });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save squad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{squad ? 'Edit Squad' : 'Create New Squad'}</h2>
          <button className="btn-close" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="squad-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="squadNumber">Squad Number *</label>
              <input
                type="number"
                id="squadNumber"
                value={formData.squadNumber}
                onChange={(e) => handleChange('squadNumber', parseInt(e.target.value) || 0)}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Squad Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Alpha Squad"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="targetNumber">Target Number *</label>
              <input
                type="number"
                id="targetNumber"
                value={formData.targetNumber}
                onChange={(e) => handleChange('targetNumber', parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetDescription">Target Description *</label>
              <input
                type="text"
                id="targetDescription"
                value={formData.targetDescription}
                onChange={(e) => handleChange('targetDescription', e.target.value)}
                placeholder="e.g., experiments per quarter"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Members *</label>
            <div className="members-list">
              {formData.members.map((member, index) => (
                <div key={index} className="member-row">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                    placeholder="Member name"
                  />
                  <input
                    type="text"
                    value={member.role}
                    onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                    placeholder="Role"
                  />
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeMember(index)}
                    disabled={formData.members.length === 1}
                    title="Remove member"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="btn-secondary" onClick={addMember}>
              + Add Member
            </button>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : squad ? 'Update Squad' : 'Create Squad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SquadForm;
