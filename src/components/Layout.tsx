import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Gamepad2, BarChart3, Settings, BrainCircuit, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import { Outlet } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: Gamepad2 },
  { path: '/progress', label: 'Progress', icon: BarChart3 },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { progress, setActiveProfile } = useProgress();

  const handleSwitchProfile = () => {
    setActiveProfile(null as any); 
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-light font-nunito">
      {/* Top Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50 safe-top">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-fredoka text-xl leading-none text-text-dark">Abacus Mind</h1>
              <p className="text-xs text-text-light font-nunito">Mental Math for Kids</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-bold text-amber-700">{progress?.streak || 0}</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <span className="text-sm font-bold text-primary-dark">Lv.{progress?.level || 1}</span>
              <div className="w-16 h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${((progress?.xp || 0) % 500) / 5}%` }}
                />
              </div>
              <span className="text-xs text-text-light">{progress?.xp || 0}</span>
            </div>
            <button
              onClick={handleSwitchProfile}
              className="p-2 rounded-xl hover:bg-red-50 transition-colors group relative"
              aria-label="Switch Profile"
            >
              <LogOut className="w-5 h-5 text-text-medium group-hover:text-red-500" />
            </button>
            <Link
              to="/parents"
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Parent Dashboard"
            >
              <Settings className="w-5 h-5 text-text-medium" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="sm:hidden bg-white border-t border-gray-100 sticky bottom-0 z-50 safe-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-text-light'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
