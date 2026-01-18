import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { ResumeSummary } from '../types/resume';
import { dummyResumes } from '../utils/dummyData';

const ResumeDashboard = () => {
  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { resumes } = await resumeAPI.getResumes();
      setResumes(resumes.length > 0 ? resumes : dummyResumes);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      // Fallback to dummy data
      setResumes(dummyResumes);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume(resumeId);
      setResumes(resumes.filter((r) => r._id !== resumeId));
    } catch (error) {
      console.error('Failed to delete resume:', error);
      alert('Failed to delete resume');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 rounded-card border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-heading mb-1">
                Your Resumes
              </h2>
              <p className="text-text-body">
                Create, customize, and download professional resumes
              </p>
            </div>
            <Link to="/resume/new" className="btn-primary">
              + Create New Resume
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-text-muted">Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-text-heading mb-2">No resumes yet</h4>
              <p className="text-text-body mb-6">
                Create your first professional resume with our easy-to-use builder. Choose from multiple templates and customize to match your style.
              </p>
              <Link to="/resume/new" className="btn-primary inline-block">
                Create Your First Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="card hover:shadow-card-hover transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-heading mb-2">
                      {resume.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-purple-100 text-secondary text-xs font-medium rounded-button capitalize">
                        {resume.template}
                      </span>
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: resume.colorTheme }}
                        title={resume.colorTheme}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-muted mb-4">
                  Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/resume/${resume._id}`}
                    className="flex-1 btn-primary text-center text-sm py-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-button text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeDashboard;
