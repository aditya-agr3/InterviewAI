import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { learningAPI } from '../services/api';
import { Document } from '../types/learning';
import AIChat from '../components/learning/AIChat';
import DocumentSummary from '../components/learning/DocumentSummary';
import ConceptExplainer from '../components/learning/ConceptExplainer';
import { dummyDocuments } from '../utils/dummyData';

const DocumentViewer = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [searchParams] = useSearchParams();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'viewer' | 'chat' | 'summary' | 'explain'>('viewer');
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (documentId) {
      fetchDocument();
      const tab = searchParams.get('tab');
      if (tab && ['chat', 'summary', 'explain'].includes(tab)) {
        setActiveTab(tab as any);
      }
    }
  }, [documentId, searchParams]);

  // Cleanup: revoke object URL when component unmounts or URL changes
  useEffect(() => {
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const fetchDocument = async () => {
    if (!documentId) return;

    try {
      const data = await learningAPI.getDocument(documentId);
      setDocument(data.document);
      try {
        const url = await learningAPI.getDocumentUrl(documentId);
        setPdfUrl(url);
      } catch (urlError) {
        console.error('Failed to load PDF:', urlError);
        setPdfError(true);
      }
    } catch (error: any) {
      // If backend is not available, try to find document in dummy data
      if (error.response?.status === 404 || error.response?.status === 500) {
        const dummyDoc = dummyDocuments.find(d => d._id === documentId);
        if (dummyDoc) {
          setDocument(dummyDoc);
          // For demo mode, we can't show actual PDF, but we can show a message
          setPdfError(false);
        } else {
          setPdfError(true);
        }
      } else {
        console.error('Failed to fetch document:', error);
        setPdfError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'viewer', label: 'Viewer', icon: '📄' },
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'summary', label: 'Summary', icon: '📝' },
    { id: 'explain', label: 'Explain', icon: '🔍' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-text-muted">Loading document...</p>
        </div>
      </div>
    );
  }

  if (pdfError || !document) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="card text-center max-w-md">
          <h2 className="text-2xl font-bold text-text-heading mb-4">Document Not Found</h2>
          <p className="text-text-body mb-6">The document you're looking for doesn't exist or has been deleted.</p>
          <Link to="/learning/documents" className="btn-primary">
            Back to Documents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text-heading mb-2">{document.originalName}</h1>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>Uploaded {new Date(document.uploadDate).toLocaleDateString()}</span>
                {document.pageCount && <span>• {document.pageCount} pages</span>}
              </div>
            </div>
            <Link to="/learning/documents" className="btn-secondary">
              ← Back to Documents
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-body hover:text-text-heading'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="card p-0 overflow-hidden">
          {activeTab === 'viewer' && (
            <div className="h-[calc(100vh-300px)] min-h-[600px]">
              {pdfUrl && !pdfUrl.includes('demo') ? (
                <iframe
                  src={pdfUrl}
                  className="w-full h-full border-0"
                  title={document.originalName}
                  onError={() => setPdfError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="mb-6">
                      <svg className="w-24 h-24 mx-auto text-text-muted opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-text-heading mb-2">PDF Viewer</h3>
                    <p className="text-text-body mb-4">
                      {document.originalName}
                    </p>
                    <p className="text-sm text-text-muted">
                      In demo mode, the PDF viewer requires the backend API to be connected. The document is stored, but the file cannot be displayed without the backend service.
                    </p>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-button">
                      <p className="text-sm text-blue-800">
                        <strong>Demo Mode:</strong> This is a demonstration of the interface. Connect the backend API to enable full PDF viewing functionality.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && documentId && (
            <div className="p-6">
              <AIChat documentId={documentId} />
            </div>
          )}

          {activeTab === 'summary' && documentId && (
            <div className="p-6">
              <DocumentSummary documentId={documentId} documentName={document.originalName} />
            </div>
          )}

          {activeTab === 'explain' && documentId && (
            <div className="p-6">
              <ConceptExplainer documentId={documentId} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DocumentViewer;
