import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  answer: string;
  aiExplanation?: string;
  isPinned: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  jobRole: string;
  experienceLevel: string;
  techStack: string[];
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    aiExplanation: {
      type: String,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSessionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    experienceLevel: {
      type: String,
      required: [true, 'Experience level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    },
    techStack: {
      type: [String],
      required: true,
      default: [],
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);
