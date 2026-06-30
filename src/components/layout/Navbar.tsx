import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Menu, X, Shield, LogOut } from 'lucide-react';
import { useTournamentStore } from '../../store/tournamentStore';

const NAV_ITEMS = [
  { label: 'Home',        path: '/' },
  { label: 'Live',        path: '/live' },
  { label: 'Carrom',      path: '/carrom' },
  { label: 'Sequence',    path: '/sequence' },
  { label: 'Teams',       path: '/teams' },
  { label: 'Players',     path: '/players' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Schedule',    path: '/schedule' },
  { label: 'Gallery',     path: '/gallery' },
  { label: 'History',     path: '/history' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, userRole, logout } = useTournamentStore();
  const location = useLocation();
  const liveCount = useTournamentStore((s) => s.matches.filter((m) => m.status === 'live').length);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-[15px] text-gray-900 leading-none">Josh</div>
                <div className="text-[11px] text-gray-500 leading-none mt-0.5">Carrom & Sequence</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-lg bg-blue-50 border border-blue-100"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                    {item.path === '/live' && liveCount > 0 && (
                      <span className="absolute -top-0.5 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {liveCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {isAdmin ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    <Shield className="w-3.5 h-3.5" />
                    {userRole === 'admin' ? 'Admin' : 'Umpire'}
                  </Link>
                  <button onClick={logout} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                  Login
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden fixed top-16 inset-x-0 z-40 bg-white border-b border-gray-200"
            style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
          >
            <div className="p-3 grid grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                    {item.path === '/live' && liveCount > 0 && (
                      <span className="w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {liveCount}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link to={isAdmin ? '/admin' : '/login'} onClick={() => setMobileOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Shield className="w-4 h-4" />
                {isAdmin ? 'Go to Admin' : 'Admin Login'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
