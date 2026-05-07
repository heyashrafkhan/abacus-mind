import { motion } from 'framer-motion';
import { Star, Trophy, Zap, BookOpen, TrendingUp, Award, Flame, Target } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { lessons } from '../data/curriculum';

const badgesList = [
  { id: 'first_steps', name: 'First Steps', desc: 'Complete your first lesson', icon: <BookOpen className="w-6 h-6" /> },
  { id: 'perfect_lesson', name: 'Perfect Score', desc: 'Get 100% on a lesson quiz', icon: <Star className="w-6 h-6" /> },
  { id: 'streak_star', name: 'Streak Star', desc: 'Answer 5 questions correctly in a row', icon: <Flame className="w-6 h-6" /> },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete a challenge in under 60 seconds', icon: <Zap className="w-6 h-6" /> },
  { id: 'mental_master', name: 'Mental Master', desc: 'Solve 10 problems in Mental Math mode', icon: <Target className="w-6 h-6" /> },
  { id: 'level_5', name: 'Level 5', desc: 'Reach level 5', icon: <Trophy className="w-6 h-6" /> },
];

export default function ProgressPage() {
  const { progress } = useProgress();
  const progressData = progress ?? null;

  const completedLessons = Object.values(progressData?.lessonsProgress ?? {}).filter(l => l.completed).length;
  const totalLessons = lessons.length;
  const completionPercent = Math.round((completedLessons / totalLessons) * 100);

  const skills = [
    { name: 'Addition', value: Math.min(100, (progressData?.xp ?? 0) / 5) },
    { name: 'Subtraction', value: Math.min(100, (progressData?.xp ?? 0) / 8) },
    { name: 'Speed', value: Math.min(100, (progressData?.totalProblemsSolved ?? 0) * 3) },
    { name: 'Mental Math', value: Math.min(100, (progressData?.xp ?? 0) / 10) },
    { name: 'Accuracy', value: progressData?.accuracy ?? 0 },
    { name: 'Consistency', value: Math.min(100, (progressData?.streak ?? 0) * 10) },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h2 className="font-fredoka text-3xl text-text-dark">Your Progress</h2>
        <p className="text-text-medium">See how your math superpowers are growing!</p>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <HeroStat icon={<Trophy className="w-6 h-6 text-accent-purple" />} label="Level" value={progressData?.level ?? 1} />
        <HeroStat icon={<Star className="w-6 h-6 text-amber-500" />} label="XP" value={progressData?.xp ?? 0} />
        <HeroStat icon={<BookOpen className="w-6 h-6 text-primary" />} label="Lessons" value={`${completedLessons}/${totalLessons}`} />
        <HeroStat icon={<Zap className="w-6 h-6 text-secondary" />} label="Accuracy" value={`${progressData?.accuracy ?? 0}%`} />
      </div>

      {/* Skill Tree */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-fredoka text-xl text-text-dark mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" /> Skill Radar
        </h3>
        <div className="space-y-4">
          {skills.map(skill => (
            <div key={skill.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-text-medium">{skill.name}</span>
                <span className="text-sm font-bold text-primary">{Math.round(skill.value)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-fredoka text-xl text-text-dark mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-yellow" /> Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badgesList.map(badge => {
            const earned = progressData?.badges.includes(badge.id) ?? false;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  earned
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                  earned ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'
                }`}>
                  {badge.icon}
                </div>
                <h4 className="font-bold text-sm text-text-dark">{badge.name}</h4>
                <p className="text-xs text-text-light">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lesson Completion */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-fredoka text-xl text-text-dark mb-4">Lesson Completion</h3>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <motion.path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4F8CFF"
                strokeWidth="3"
                strokeDasharray={`${completionPercent}, 100`}
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: `${completionPercent}, 100` }}
                transition={{ duration: 1.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-fredoka text-lg text-text-dark">
              {completionPercent}%
            </div>
          </div>
          <div>
            <p className="text-text-medium font-bold">{completedLessons} of {totalLessons} lessons completed</p>
            <p className="text-text-light text-sm">Keep going, you're doing amazing!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="font-fredoka text-2xl text-text-dark">{value}</div>
      <div className="text-xs text-text-light font-bold uppercase">{label}</div>
    </div>
  );
}
