import { Schema, model, Document } from 'mongoose';

export interface ISquad extends Document {
  squadNumber: number;
  name: string;
  members: Array<{
    name: string;
    role: string;
  }>;
  targetNumber: number;
  targetDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

const squadSchema = new Schema<ISquad>({
  squadNumber: {
    type: Number,
    required: true,
    unique: true,
    min: 1
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    unique: true
  },
  members: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    }
  }],
  targetNumber: {
    type: Number,
    required: true,
    min: 0
  },
  targetDescription: {
    type: String,
    required: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
squadSchema.index({ squadNumber: 1 });
squadSchema.index({ name: 1 });

const Squad = model<ISquad>('Squad', squadSchema);

export default Squad;
