import { useMemo, useState } from 'react';
import { outreachAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const platformOptions = ['Email', 'LinkedIn', 'Text'] as const;
const toneOptions = ['Friendly', 'Confident', 'Professional', 'Concise'] as const;
const relationshipOptions = ['Cold outreach', 'Warm intro', 'Referral request', 'Alumni'] as const;
const lengthOptions = ['Short', 'Medium', 'Long'] as const;

const OutreachGenerator = () => {
  const { user } = useAuth();
  const [platform, setPlatform] = useState<(typeof platformOptions)[number]>('Email');
  const [tone, setTone] = useState<(typeof toneOptions)[number]>('Friendly');
  const [relationship, setRelationship] = useState<(typeof relationshipOptions)[number]>('Cold outreach');
  const [length, setLength] = useState<(typeof lengthOptions)[number]>('Medium');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [senderName, setSenderName] = useState(user?.name || '');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = useMemo(() => {
    return jobDescription.trim().length > 0 && resumeFile;
  }, [jobDescription, resumeFile]);

  const handleGenerate = async () => {
    if (!resumeFile) {
      setError('Please upload your resume PDF.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    setError('');
    setLoading(true);
    setMessages([]);

    try {
      const response = await outreachAPI.generateMessages({
        platform,
        tone,
        relationship,
        length,
        jobDescription,
        resumeFile,
        companyName: companyName.trim(),
        roleTitle: roleTitle.trim(),
        recruiterName: recruiterName.trim(),
        senderName: senderName.trim(),
      });
      setMessages(response.messages || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to generate outreach messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (message: string) => {
    await navigator.clipboard.writeText(message);
  };

  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-heading mb-2">Outreach Generator</h1>
          <p className="text-text-body">
            Generate human, tailored messages for recruiters based on the job description and your resume.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="card">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm font-semibold text-text-heading mb-3">Platform</p>
                <div className="flex flex-wrap gap-3">
                  {platformOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setPlatform(option)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        platform === option
                          ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-card'
                          : 'bg-bg-card border border-text-muted text-text-body hover:border-primary'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-text-heading">Tone</label>
                  <select
                    value={tone}
                    onChange={(event) => setTone(event.target.value as typeof tone)}
                    className="input-field mt-2"
                  >
                    {toneOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-text-heading">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(event) => setRelationship(event.target.value as typeof relationship)}
                    className="input-field mt-2"
                  >
                    {relationshipOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-text-heading">Length</label>
                  <select
                    value={length}
                    onChange={(event) => setLength(event.target.value as typeof length)}
                    className="input-field mt-2"
                  >
                    {lengthOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-text-heading">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(event) => setJobDescription(event.target.value)}
                  rows={8}
                  className="input-field mt-2 resize-none"
                  placeholder="Paste the full job description here..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-text-heading">Company</label>
                  <input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    className="input-field mt-2"
                    placeholder="e.g. Google"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-text-heading">Role</label>
                  <input
                    value={roleTitle}
                    onChange={(event) => setRoleTitle(event.target.value)}
                    className="input-field mt-2"
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-text-heading">Recruiter Name</label>
                  <input
                    value={recruiterName}
                    onChange={(event) => setRecruiterName(event.target.value)}
                    className="input-field mt-2"
                    placeholder="e.g. Priya"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-text-heading">Your Name</label>
                  <input
                    value={senderName}
                    onChange={(event) => setSenderName(event.target.value)}
                    className="input-field mt-2"
                    placeholder="e.g. Aditya"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-text-heading">Resume (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
                  className="mt-2 block w-full text-sm text-text-body"
                />
                {resumeFile && (
                  <p className="text-xs text-text-muted mt-1">{resumeFile.name}</p>
                )}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleGenerate}
                disabled={!isValid || loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Messages'}
              </button>
            </div>
          </section>

          <section className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-heading">Generated Messages</h2>
              <span className="text-xs text-text-muted">3 tailored options</span>
            </div>

            {messages.length === 0 && !loading && (
              <div className="text-sm text-text-muted">
                Your messages will appear here once generated.
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={`${index}-${message.slice(0, 12)}`} className="p-4 rounded-card border border-purple-100 bg-gradient-to-br from-white to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-widest text-text-muted">
                      Option {index + 1}
                    </span>
                    <button
                      onClick={() => handleCopy(message)}
                      className="text-xs font-medium text-primary hover:text-secondary"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-text-body whitespace-pre-line">{message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OutreachGenerator;
