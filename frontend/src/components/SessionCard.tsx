import { Link } from 'react-router-dom';
import { SessionSummary } from '../types';

interface SessionCardProps {
  session: SessionSummary;
  questionCount?: number;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, questionCount = 2 }) => {
  const progress = 100; // Assuming all questions are available
  
  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-text-heading mb-1 group-hover:text-primary transition-colors">
            {session.jobRole}
          </h3>
          <p className="text-sm text-text-muted mb-3">
            {session.experienceLevel} Level
          </p>
        </div>
        <div className="px-2 py-1 bg-purple-50 text-secondary text-xs font-medium rounded-button">
          {questionCount} Qs
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {session.techStack.slice(0, 4).map((tech, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-gray-100 text-text-body text-xs font-medium rounded-button"
          >
            {tech}
          </span>
        ))}
        {session.techStack.length > 4 && (
          <span className="px-2.5 py-1 text-text-muted text-xs">
            +{session.techStack.length - 4}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link
          to={`/session/${session._id}`}
          className="flex-1 btn-primary text-center text-sm py-2"
        >
          Continue Practice
        </Link>
        <Link
          to="/pinned"
          className="px-4 py-2 border border-gray-300 text-text-body hover:bg-gray-50 rounded-button text-sm font-medium transition-colors"
        >
          Pins
        </Link>
      </div>

      <p className="text-xs text-text-muted mt-3">
        Created {new Date(session.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}
      </p>
    </div>
  );
};

export default SessionCard;
