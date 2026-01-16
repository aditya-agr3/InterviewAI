import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  documentId: mongoose.Types.ObjectId;
  title: string;
  questions: IQuizQuestion[];
  score?: number;
  totalQuestions: number;
  userAnswers?: Map<string, number>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema: Schema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length >= 2,
        message: 'At least 2 options are required',
      },
    },
    correctAnswer: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
    },
  },
  { _id: true }
);

const QuizSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
      required: [true, 'Document ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    questions: {
      type: [QuizQuestionSchema],
      required: true,
    },
    score: {
      type: Number,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    userAnswers: {
      type: Map,
      of: Number,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);
