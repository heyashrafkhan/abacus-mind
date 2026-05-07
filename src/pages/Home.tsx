import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Gamepad2, Trophy, BrainCircuit, ArrowRight, Star } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import Abacus from '../components/Abacus';

export default function Home() {
  const { progress } = useProgress();

  const nextLesson = progress?.lessonsProgress ?? {};
  const completedCount = Object.values(nextLesson).filter(l => l.completed).length;
  const totalLessons = 6; // For demo

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light/20 to-secondary-light/20 rounded-3xl p-6 sm:p-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-fredoka text-3xl sm:text-4xl text-text-dark mb-3">
                Hi, Math Explorer! 👋
              </h2>
              <p className="text-text-medium text-lg mb-6 max-w-md">
                Ready to train your brain with the ancient abacus? Let's build your mental math superpowers today!
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-primary/25"
                >
                  <BookOpen className="w-5 h-5" />
                  Start Learning
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/practice"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-text-dark px-6 py-3 rounded-2xl font-bold text-lg transition-colors border-2 border-gray-100"
                >
                  <Gamepad2 className="w-5 h-5 text-secondary" />
                  Practice
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="flex-shrink-0">
            <Abacus numRods={1} interactive={false} showLabels={false} />
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Star className="w-6 h-6 text-amber-500" />} label="XP Points" value={progress?.xp ?? 0} color="bg-amber-50 border-amber-200" />
        <StatCard icon={<Trophy className="w-6 h-6 text-accent-purple" />} label="Level" value={progress?.level ?? 1} color="bg-purple-50 border-purple-200" />
        <StatCard icon={<BookOpen className="w-6 h-6 text-primary" />} label="Lessons Done" value={`${completedCount}/${totalLessons}`} color="bg-blue-50 border-blue-200" />
        <StatCard icon={<BrainCircuit className="w-6 h-6 text-accent-green" />} label="Accuracy" value={`${progress?.accuracy ?? 0}%`} color="bg-green-50 border-green-200" />
      </div>

      {/* Continue Learning */}
      <section>
        <h3 className="font-fredoka text-2xl text-text-dark mb-4">Continue Your Journey</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickCard
            to="/learn"
            title="Lessons"
            description="Master the abacus step by step"
            icon={<BookOpen className="w-8 h-8 text-primary" />}
            color="bg-primary/10"
          />
          <QuickCard
            to="/practice"
            title="Practice Studio"
            description="Free play and speed drills"
            icon={<Gamepad2 className="w-8 h-8 text-secondary" />}
            color="bg-secondary/10"
          />
          <QuickCard
            to="/progress"
            title="Your Progress"
            description="Track your math superpowers"
            icon={<Trophy className="w-8 h-8 text-accent-purple" />}
            color="bg-accent-purple/10"
          />
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className={`${color} border rounded-2xl p-4 flex items-center gap-3`}>
      <div className="bg-white rounded-xl p-2 shadow-sm">{icon}</div>
      <div>
        <p className="text-text-light text-xs font-bold uppercase tracking-wide">{label}</p>
        <p className="font-fredoka text-2xl text-text-dark">{value}</p>
      </div>
    </div>
  );
}

function QuickCard({ to, title, description, icon, color }: { to: string; title: string; description: string; icon: React.ReactNode; color: string }) {
  return (
    <Link to={to} className={`${color} rounded-2xl p-5 hover:scale-[1.02] transition-transform group`}>
      <div className="bg-white rounded-xl w-12 h-12 flex items-center justify-center shadow-sm mb-3">
        {icon}
      </div>
      <h4 className="font-fredoka text-lg text-text-dark group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-text-medium text-sm">{description}</p>
    </Link>
  );
}
