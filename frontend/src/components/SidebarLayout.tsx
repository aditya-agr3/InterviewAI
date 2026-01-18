import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <img src="/icons/dashboard.svg" alt="" className="w-5 h-5" />
    ),
  },
  {
    to: '/interview-sessions',
    label: 'Interview Practice',
    icon: (
      <img
        src="/icons/monitor-mobbile.svg"
        alt=""
        className="w-5 h-5"
        style={{ filter: 'brightness(0)' }}
      />
    ),
  },
  {
    to: '/resumes',
    label: 'Resume Builder',
    icon: (
      <img
        src="/icons/edit.svg"
        alt=""
        className="w-5 h-5"
        style={{ filter: 'brightness(0)' }}
      />
    ),
  },
  {
    to: '/learning',
    label: 'Learning Assistant',
    icon: (
      <img
        src="/icons/presention-chart.svg"
        alt=""
        className="w-5 h-5"
        style={{ filter: 'brightness(0)' }}
      />
    ),
  },
  {
    to: '/outreach',
    label: 'Outreach',
    icon: (
      <img
        src="/icons/message-programming.svg"
        alt=""
        className="w-5 h-5"
        style={{ filter: 'brightness(0)' }}
      />
    ),
  },
];

const SidebarLayout = () => {
  const { user, logout } = useAuth();
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className="hidden lg:flex lg:w-64 bg-bg-card shadow-card border-r border-purple-100 flex-col sticky top-0 h-screen overflow-hidden">
        <div className="px-4 py-6">
          <Link to="/dashboard" className="flex items-center w-full">
            <img src="/icons/logo.svg" alt="InterviewAI logo" className="w-full h-auto max-h-16" />
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-button transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-primary font-medium'
                    : 'text-text-body hover:text-text-heading hover:bg-purple-50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-6">
          <div className="pt-6 border-t border-purple-100">
            <p className="text-xs uppercase tracking-widest text-text-muted mb-3">Others</p>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2 rounded-button text-text-body hover:text-text-heading hover:bg-purple-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 4a7.97 7.97 0 01-.13 1.46l2.01 1.57-2 3.46-2.43-.98a7.93 7.93 0 01-2.53 1.47l-.36 2.56H9.5l-.36-2.56a7.93 7.93 0 01-2.53-1.47l-2.43.98-2-3.46 2.01-1.57A7.97 7.97 0 014.06 12c0-.5.04-.99.13-1.46L2.18 8.97l2-3.46 2.43.98a7.93 7.93 0 012.53-1.47L9.5 2.46h5l.36 2.56a7.93 7.93 0 012.53 1.47l2.43-.98 2 3.46-2.01 1.57c.09.47.13.96.13 1.46z" />
              </svg>
              Settings
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-card bg-white/80 border border-purple-100 p-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center text-sm font-semibold">
              {initials || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-text-heading truncate">{userName}</p>
              <p className="text-xs text-text-muted truncate">{userEmail || 'Signed in'}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <header className="bg-bg-card shadow-card sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 lg:hidden">
                <img src="/icons/logo.svg" alt="InterviewAI logo" className="h-9 w-auto" />
                <span className="text-lg font-semibold text-text-heading">InterviewAI</span>
              </div>
              <div className="ml-auto flex items-center gap-4">
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
