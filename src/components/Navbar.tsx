import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // show only login link when not signed in; otherwise show full nav including admin
  const navItems = user
    ? [
        { path: '/', label: 'Home' },
        { path: '/screening', label: 'Screening' },
        { path: '/emotional-care', label: 'Emotional Care' },
        { path: '/self-care', label: 'Self-Care' },
        { path: '/community', label: 'Community' },
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/resources', label: 'Resources' },
        { path: '/admin', label: 'Admin' },
      ]
    : [{ path: '/login', label: 'Login' }];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mint-100 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-mint-400 to-sky-400 group-hover:shadow-softLg transition-shadow">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-mint-600 to-sky-600 bg-clip-text text-transparent">
              MindScan+
            </span>
          </Link>

          <div className="hidden md:flex gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              // highlight the login link as a CTA when user is not signed in
              if (!user && item.path === '/login') {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-mint-500 to-sky-500 text-white shadow-soft'
                        : 'bg-mint-100 text-mint-700 hover:shadow-softLg'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-mint-100 text-mint-700' : 'text-gray-600 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-softLg transition-all duration-200 hover:scale-105">
                Get Help
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-softLg transition-all duration-200 hover:scale-105"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-sky-50 transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 animate-slideUp">
            <div className="flex flex-col gap-2">
              {navItems.map(item => {
                const isActive = location.pathname === item.path;
                if (!user && item.path === '/login') {
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-mint-500 to-sky-500 text-white shadow-soft'
                          : 'bg-mint-100 text-mint-700 hover:shadow-softLg'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-mint-100 text-mint-700' : 'text-gray-600 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button className="mt-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-softLg transition-all duration-200">
                Get Help
              </button>
              <button
                className="mt-2 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-mint-500 to-sky-500 text-white font-medium hover:shadow-softLg transition-all duration-200"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}