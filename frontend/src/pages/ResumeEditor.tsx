import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { Resume, PersonalInfo, Experience, Education, Skill } from '../types/resume';
import ResumePreview from '../components/ResumePreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ResumeEditor = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'other'>('personal');

  const isNew = resumeId === 'new';

  useEffect(() => {
    if (!isNew) {
      fetchResume();
    } else {
      // Initialize new resume
      setResume({
        _id: '',
        userId: '',
        title: 'My Resume',
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        template: 'modern',
        colorTheme: '#4F46E5',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      if (!resumeId) return;
      const { resume } = await resumeAPI.getResume(resumeId);
      setResume(resume);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resume) return;

    setSaving(true);
    try {
      if (isNew) {
        const { resume: newResume } = await resumeAPI.createResume(resume);
        navigate(`/resume/${newResume._id}`);
      } else {
        await resumeAPI.updateResume(resume._id, resume);
      }
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 } as any);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${resume?.personalInfo.firstName || 'resume'}-${resume?.personalInfo.lastName || 'resume'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF');
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    if (!resume) return;
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value,
      },
    });
  };

  const addExperience = () => {
    if (!resume) return;
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: '',
          current: false,
        },
      ],
    });
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | boolean) => {
    if (!resume) return;
    const updated = [...resume.experience];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, experience: updated });
  };

  const removeExperience = (index: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    if (!resume) return;
    setResume({
      ...resume,
      education: [
        ...resume.education,
        {
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    });
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    if (!resume) return;
    const updated = [...resume.education];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, education: updated });
  };

  const removeEducation = (index: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    if (!resume) return;
    setResume({
      ...resume,
      skills: [
        ...resume.skills,
        { name: '', level: 'Intermediate' },
      ],
    });
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    if (!resume) return;
    const updated = [...resume.skills];
    updated[index] = { ...updated[index], [field]: value };
    setResume({ ...resume, skills: updated });
  };

  const removeSkill = (index: number) => {
    if (!resume) return;
    setResume({
      ...resume,
      skills: resume.skills.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !resume || !resumeId || isNew) return;

    try {
      const { imageUrl } = await resumeAPI.uploadImage(resumeId, e.target.files[0]);
      updatePersonalInfo('profileImage', imageUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    }
  };

  const colorThemes = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Purple', value: '#7C3AED' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Pink', value: '#EC4899' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-text-muted">Loading resume...</div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="card text-center">
          <p className="text-text-body mb-4">Resume not found</p>
          <Link to="/resumes" className="btn-primary">
            Back to Resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-bg-card shadow-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/resumes" className="text-text-muted hover:text-text-heading">
              ← Back to Resumes
            </Link>
            <h1 className="text-xl font-bold text-text-heading">Resume Editor</h1>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-secondary text-sm">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleDownloadPDF} className="btn-primary text-sm">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Template & Color Selector */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-heading mb-4">Template & Theme</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">Template</label>
                  <select
                    value={resume.template}
                    onChange={(e) => setResume({ ...resume, template: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">Color Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorThemes.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setResume({ ...resume, colorTheme: color.value })}
                        className={`h-10 rounded-button border-2 transition-all ${
                          resume.colorTheme === color.value
                            ? 'border-text-heading scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card">
              <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200">
                {(['personal', 'summary', 'experience', 'education', 'skills', 'other'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-muted hover:text-text-heading'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-1">First Name</label>
                      <input
                        type="text"
                        value={resume.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-1">Last Name</label>
                      <input
                        type="text"
                        value={resume.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1">Phone</label>
                    <input
                      type="tel"
                      value={resume.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={resume.personalInfo.linkedIn || ''}
                      onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                      className="input-field"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-1">GitHub</label>
                    <input
                      type="url"
                      value={resume.personalInfo.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      className="input-field"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  {!isNew && (
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-1">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="input-field"
                      />
                      {resume.personalInfo.profileImage && (
                        <img
                          src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${resume.personalInfo.profileImage}`}
                          alt="Profile"
                          className="mt-2 w-24 h-24 rounded-full object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Summary Tab */}
              {activeTab === 'summary' && (
                <div>
                  <label className="block text-sm font-medium text-text-heading mb-2">Professional Summary</label>
                  <textarea
                    value={resume.summary}
                    onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                    className="input-field min-h-[150px]"
                    placeholder="Write a brief summary of your professional background..."
                  />
                </div>
              )}

              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <div className="space-y-4">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-button">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-text-heading">Experience {idx + 1}</h4>
                        <button
                          onClick={() => removeExperience(idx)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Position"
                          value={exp.position}
                          onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                          className="input-field"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Start Date (e.g., Jan 2020)"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                            className="input-field"
                            disabled={exp.current}
                          />
                        </div>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(idx, 'current', e.target.checked)}
                          />
                          <span className="text-sm text-text-body">Current Position</span>
                        </label>
                        <textarea
                          placeholder="Description"
                          value={exp.description || ''}
                          onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                          className="input-field min-h-[80px]"
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={addExperience} className="btn-secondary w-full">
                    + Add Experience
                  </button>
                </div>
              )}

              {/* Education Tab */}
              {activeTab === 'education' && (
                <div className="space-y-4">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-button">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-text-heading">Education {idx + 1}</h4>
                        <button
                          onClick={() => removeEducation(idx)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="School/University"
                          value={edu.school}
                          onChange={(e) => updateEducation(idx, 'school', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Field of Study"
                          value={edu.field}
                          onChange={(e) => updateEducation(idx, 'field', e.target.value)}
                          className="input-field"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Start Date"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                            className="input-field"
                          />
                          <input
                            type="text"
                            placeholder="End Date"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={addEducation} className="btn-secondary w-full">
                    + Add Education
                  </button>
                </div>
              )}

              {/* Skills Tab */}
              {activeTab === 'skills' && (
                <div className="space-y-4">
                  {resume.skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Skill name"
                        value={skill.name}
                        onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                        className="input-field flex-1"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(idx, 'level', e.target.value)}
                        className="input-field w-40"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button
                        onClick={() => removeSkill(idx)}
                        className="px-3 text-red-600 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button onClick={addSkill} className="btn-secondary w-full">
                    + Add Skill
                  </button>
                </div>
              )}

              {/* Other Tab */}
              {activeTab === 'other' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">Certifications (one per line)</label>
                    <textarea
                      value={resume.certifications?.join('\n') || ''}
                      onChange={(e) => setResume({
                        ...resume,
                        certifications: e.target.value.split('\n').filter(c => c.trim()),
                      })}
                      className="input-field min-h-[100px]"
                      placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]">
            <div className="card">
              <h3 className="text-lg font-semibold text-text-heading mb-4">Live Preview</h3>
              <div className="overflow-auto max-h-[calc(100vh-12rem)] border border-gray-200 rounded-button p-4 bg-gray-50">
                <div id="resume-preview">
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
