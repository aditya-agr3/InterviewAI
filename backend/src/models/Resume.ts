import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string;
  current?: boolean;
}

export interface ISkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    linkedIn?: string;
    github?: string;
    website?: string;
    profileImage?: string;
  };
  summary: string;
  experience: IExperience[];
  education: IEducation[];
  skills: ISkill[];
  certifications?: string[];
  languages?: Array<{ name: string; proficiency: string }>;
  template: string;
  colorTheme: string;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema: Schema = new Schema({
  school: { type: String, required: true },
  degree: { type: String, required: true },
  field: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String },
}, { _id: false });

const ExperienceSchema: Schema = new Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String },
  current: { type: Boolean, default: false },
}, { _id: false });

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true,
  },
}, { _id: false });

const ResumeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'My Resume',
    },
    personalInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
      linkedIn: { type: String },
      github: { type: String },
      website: { type: String },
      profileImage: { type: String },
    },
    summary: {
      type: String,
      default: '',
    },
    experience: {
      type: [ExperienceSchema],
      default: [],
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    skills: {
      type: [SkillSchema],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    languages: {
      type: [{
        name: { type: String, required: true },
        proficiency: { type: String, required: true },
      }],
      default: [],
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'creative', 'minimal'],
      default: 'modern',
    },
    colorTheme: {
      type: String,
      default: '#4F46E5', // Default indigo
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
