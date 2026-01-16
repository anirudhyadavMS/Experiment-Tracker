import { Schema, model, Document } from 'mongoose';

export interface IExperiment extends Document {
  // Basic Information
  name: string;
  description: string;
  owner: string;
  status: 'running' | 'completed' | 'paused';

  // Timeline
  startDate: Date;
  endDate?: Date;

  // Hypothesis & Metrics
  hypothesis: string;
  successMetrics: string[];
  targetAudience: string;

  // Variants & Results
  variants: Array<{
    name: string;
    description: string;
    percentage: number;
  }>;

  // Outcomes
  results?: string;
  learnings?: string;
  businessImpact?: string;
  confidenceLevel?: 'low' | 'medium' | 'high';
  decision?: 'go' | 'no-go' | 'pending';

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const experimentSchema = new Schema<IExperiment>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['running', 'completed', 'paused'],
    default: 'running',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: false
  },
  hypothesis: {
    type: String,
    required: true,
    maxlength: 500
  },
  successMetrics: [{
    type: String,
    required: true
  }],
  targetAudience: {
    type: String,
    required: true,
    maxlength: 300
  },
  variants: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  results: {
    type: String,
    maxlength: 2000
  },
  learnings: {
    type: String,
    maxlength: 2000
  },
  businessImpact: {
    type: String,
    maxlength: 1000
  },
  confidenceLevel: {
    type: String,
    enum: ['low', 'medium', 'high']
  },
  decision: {
    type: String,
    enum: ['go', 'no-go', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for filtering and sorting
experimentSchema.index({ status: 1, startDate: -1 });
experimentSchema.index({ owner: 1 });
experimentSchema.index({ name: 'text', description: 'text', hypothesis: 'text' });

const Experiment = model<IExperiment>('Experiment', experimentSchema);

export default Experiment;
