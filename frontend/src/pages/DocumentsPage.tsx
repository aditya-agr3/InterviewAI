import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningAPI } from '../services/api';
import { Document } from '../types/learning';
import { dummyDocuments } from '../utils/dummyData';
import { useBackendStatus } from '../hooks/useBackendStatus';

const DocumentsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isAvailable: backendAvailable, refreshStatus } = useBackendStatus();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Auto-refresh when backend becomes available
  useEffect(() => {
    if (backendAvailable && documents.length > 0 && documents[0]._id.startsWith('doc-')) {
      // If we're showing dummy data and backend just came online, refresh
      fetchDocuments();
    }
  }, [backendAvailable]);

  const fetchDocuments = async () => {
    try {
      const data = await learningAPI.getDocuments();
      if (data.documents.length > 0) {
        setDocuments(data.documents);
        // Backend is working, update status
        await refreshStatus();
      } else {
        // Empty response - use dummy data for demo
        setDocuments(dummyDocuments);
      }
    } catch (error: any) {
      // Check if it's a 404 (backend not available) or other error
      if (error.response?.status === 404) {
        // Backend endpoint doesn't exist - use dummy data
        setDocuments(dummyDocuments);
      } else if (error.response?.status >= 500) {
        // Server error - backend exists but has issues
        console.error('Backend server error:', error);
        setDocuments(dummyDocuments);
      } else {
        // Other errors (network, etc.)
        if (error.response?.status !== 404) {
          console.error('Failed to fetch documents:', error);
        }
        setDocuments(dummyDocuments);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let progressInterval: ReturnType<typeof setInterval> | null = null;
    try {
      // Simulate upload progress
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await learningAPI.uploadDocument(file);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setUploadProgress(100);

      // Backend is working - refresh status and fetch real data
      await refreshStatus();
      
      setTimeout(() => {
        fetchDocuments();
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error: any) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      // If backend is not available, simulate successful upload with dummy data
      if (error.response?.status === 404 || error.response?.status === 500) {
        // Simulate adding a new document to the list
        const newDoc: Document = {
          _id: `doc-${Date.now()}`,
          userId: 'user1',
          filename: file.name,
          originalName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString(),
          pageCount: Math.floor(Math.random() * 50) + 20,
        };
        setDocuments([newDoc, ...documents]);
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        console.error('Upload failed:', error);
        alert(error.response?.data?.message || 'Failed to upload document. Backend API not available - using demo mode.');
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDelete = async (documentId: string, filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      await learningAPI.deleteDocument(documentId);
      setDocuments(documents.filter((doc) => doc._id !== documentId));
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-bg-card shadow-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                InterviewAI
              </Link>
              <nav className="hidden md:flex items-center gap-4">
                <Link to="/dashboard" className="text-text-body hover:text-text-heading transition-colors">
                  Dashboard
                </Link>
                <Link to="/interview-sessions" className="text-text-body hover:text-text-heading transition-colors">
                  Interview Practice
                </Link>
                <Link to="/resumes" className="text-text-body hover:text-text-heading transition-colors">
                  Resume Builder
                </Link>
                <Link to="/learning" className="text-primary font-medium">
                  Learning Assistant
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/pinned" className="text-text-body hover:text-text-heading transition-colors flex items-center gap-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="hidden sm:inline">Pinned</span>
              </Link>
              <span className="text-text-muted hidden sm:inline">Welcome, {user?.name}</span>
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text-heading mb-2">My Documents</h1>
              <p className="text-text-body">
                Upload and manage your PDF study documents
              </p>
            </div>
            <Link to="/learning" className="btn-secondary">
              ← Back to Learning
            </Link>
          </div>
        </div>

        {/* Upload Area */}
        <div
          className={`card mb-8 border-2 border-dashed transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center py-12">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-heading mb-2">
              {uploading ? 'Uploading...' : 'Upload PDF Document'}
            </h3>
            <p className="text-text-body mb-6">
              Drag and drop your PDF here, or click to browse
            </p>
            {uploading ? (
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-text-muted">{uploadProgress}%</p>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-primary"
                disabled={uploading}
              >
                Choose File
              </button>
            )}
            <p className="text-xs text-text-muted mt-4">
              Maximum file size: 10MB
            </p>
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-text-muted">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="card text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="w-24 h-24 mx-auto text-text-muted opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-text-heading mb-2">
                No documents yet
              </h4>
              <p className="text-text-body mb-6">
                Upload your first PDF document to start using AI-powered learning features.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="card hover:shadow-card-hover transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-text-heading mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {doc.originalName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        {formatFileSize(doc.fileSize)}
                      </span>
                      {doc.pageCount && (
                        <>
                          <span>•</span>
                          <span>{doc.pageCount} pages</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-2 bg-red-50 rounded-button ml-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/learning/documents/${doc._id}`)}
                    className="flex-1 btn-primary text-sm py-2"
                  >
                    Open Document
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id, doc.originalName)}
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

export default DocumentsPage;
