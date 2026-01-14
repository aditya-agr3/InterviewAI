export interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description?: string;
  current?: boolean;
}

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface PersonalInfo {
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
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications?: string[];
  languages?: Array<{ name: string; proficiency: string }>;
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  colorTheme: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeSummary {
  _id: string;
  userId: string;
  title: string;
  template: string;
  colorTheme: string;
  createdAt: string;
  updatedAt: string;
}
