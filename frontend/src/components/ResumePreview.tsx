import { Resume } from '../types/resume';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { personalInfo, summary, experience, education, skills, certifications, template, colorTheme } = resume;

  const renderModernTemplate = () => (
    <div className="bg-white p-8 shadow-lg" style={{ color: '#111827' }}>
      {/* Header */}
      <div className="border-b-4 mb-6" style={{ borderColor: colorTheme }}>
        <div className="flex items-center gap-6 mb-4">
          {personalInfo.profileImage && (
            <img
              src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${personalInfo.profileImage}`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: colorTheme }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-gray-600">{personalInfo.email} | {personalInfo.phone}</p>
            {personalInfo.linkedIn && (
              <p className="text-sm text-gray-600">LinkedIn: {personalInfo.linkedIn}</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: colorTheme }}>Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colorTheme }}>Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-lg">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-sm text-gray-600">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
              {exp.description && (
                <p className="text-gray-700 text-sm mt-1">{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colorTheme }}>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
              <p className="text-gray-600">{edu.school}</p>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colorTheme }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded text-sm"
                style={{ backgroundColor: `${colorTheme}20`, color: colorTheme }}
              >
                {skill.name} ({skill.level})
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colorTheme }}>Certifications</h2>
          <ul className="list-disc list-inside text-gray-700">
            {certifications.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );

  const renderClassicTemplate = () => (
    <div className="bg-white p-8 shadow-lg" style={{ color: '#111827' }}>
      <div className="text-center mb-6 border-b-2 pb-4" style={{ borderColor: colorTheme }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: colorTheme }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-gray-600">{personalInfo.email} | {personalInfo.phone}</p>
      </div>
      {summary && <section className="mb-6"><p className="text-gray-700">{summary}</p></section>}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: colorTheme }}>EXPERIENCE</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold">{exp.position} - {exp.company}</h3>
              <p className="text-sm text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: colorTheme }}>EDUCATION</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-semibold">{edu.degree} - {edu.school}</h3>
              <p className="text-sm text-gray-600">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2" style={{ color: colorTheme }}>SKILLS</h2>
          <p className="text-gray-700">
            {skills.map((s, i) => `${s.name}${i < skills.length - 1 ? ', ' : ''}`)}
          </p>
        </section>
      )}
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg" style={{ color: '#111827' }}>
      <div className="flex items-start gap-6 mb-6">
        {personalInfo.profileImage && (
          <img
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${personalInfo.profileImage}`}
            alt="Profile"
            className="w-32 h-32 rounded-lg object-cover shadow-md"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colorTheme }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            {personalInfo.linkedIn && <span>LinkedIn</span>}
          </div>
        </div>
      </div>
      {summary && <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${colorTheme}10` }}><p>{summary}</p></div>}
      <div className="grid grid-cols-2 gap-6">
        {experience.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: colorTheme }}>Experience</h2>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-semibold">{exp.position}</h3>
                <p className="text-sm text-gray-600">{exp.company}</p>
              </div>
            ))}
          </section>
        )}
        {education.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3" style={{ color: colorTheme }}>Education</h2>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2">
                <h3 className="font-semibold text-sm">{edu.degree}</h3>
                <p className="text-xs text-gray-600">{edu.school}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="bg-white p-8 shadow-lg" style={{ color: '#111827' }}>
      <div className="mb-6">
        <h1 className="text-2xl font-light mb-1">{personalInfo.firstName} {personalInfo.lastName}</h1>
        <p className="text-sm text-gray-600">{personalInfo.email} • {personalInfo.phone}</p>
      </div>
      {summary && <p className="text-sm text-gray-700 mb-6 leading-relaxed">{summary}</p>}
      {experience.map((exp, idx) => (
        <div key={idx} className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between">
            <span className="font-medium">{exp.position}</span>
            <span className="text-xs text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
          </div>
          <p className="text-xs text-gray-600">{exp.company}</p>
        </div>
      ))}
    </div>
  );

  switch (template) {
    case 'classic':
      return renderClassicTemplate();
    case 'creative':
      return renderCreativeTemplate();
    case 'minimal':
      return renderMinimalTemplate();
    default:
      return renderModernTemplate();
  }
};

export default ResumePreview;
