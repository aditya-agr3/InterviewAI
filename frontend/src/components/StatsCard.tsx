import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-heading mb-2">{value}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-600' : 'text-text-muted'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {trendUp ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                )}
              </svg>
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-card">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
