import { Link } from 'react-router-dom';

interface TopicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: 'purple' | 'indigo' | 'blue' | 'green' | 'yellow';
}

const TopicCard: React.FC<TopicCardProps> = ({ title, description, icon, color }) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200 group cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`p-3 bg-gradient-to-br ${colorClasses[color]} rounded-card group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-text-heading mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-muted mb-3">
            {description}
          </p>
          <Link
            to="/interview-sessions"
            className="text-sm font-medium text-primary hover:text-primary-hover inline-flex items-center gap-1"
          >
            Explore
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
