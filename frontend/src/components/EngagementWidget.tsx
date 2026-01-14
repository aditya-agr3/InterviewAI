import { useState, useEffect } from 'react';

interface EngagementWidgetProps {
  streak?: number;
  achievements?: Achievement[];
  dailyGoal?: { completed: number; total: number };
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

const EngagementWidget = ({ streak = 5, achievements = [], dailyGoal = { completed: 2, total: 5 } }: EngagementWidgetProps) => {
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    const messages = [
      "You're doing great! Keep up the momentum! 🚀",
      "Every practice session brings you closer to your goal! 💪",
      "Consistency is key - you're building great habits! ⭐",
      "Your dedication is inspiring! Keep going! 🌟",
      "You're on fire! Don't stop now! 🔥",
    ];
    setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  const progressPercentage = (dailyGoal.completed / dailyGoal.total) * 100;

  const defaultAchievements: Achievement[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first practice session',
      icon: '🎯',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: true,
      unlockedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Quiz Master',
      description: 'Score 90%+ on 5 quizzes',
      icon: '🏆',
      unlocked: false,
    },
    {
      id: '4',
      name: 'Flashcard Pro',
      description: 'Create 50 flashcards',
      icon: '📚',
      unlocked: false,
    },
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  return (
    <div className="space-y-6">
      {/* Streak & Daily Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Streak Card */}
        <div className="card bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Current Streak</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-orange-600">{streak}</span>
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-xs text-text-muted mt-2">Keep it going!</p>
            </div>
            <div className="text-4xl">⚡</div>
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-text-heading">Daily Goal</p>
              <span className="text-sm text-text-muted">
                {dailyGoal.completed}/{dailyGoal.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-text-muted">
            {dailyGoal.total - dailyGoal.completed} more to complete today!
          </p>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💬</div>
          <p className="text-text-body font-medium">{motivationalMessage}</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text-heading mb-4 flex items-center gap-2">
          <span>🏅</span>
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {displayAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-button border-2 transition-all ${
                achievement.unlocked
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    achievement.unlocked ? 'text-text-heading' : 'text-text-muted'
                  }`}>
                    {achievement.name}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {achievement.description}
                  </p>
                </div>
                {achievement.unlocked && (
                  <span className="text-yellow-500">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EngagementWidget;
