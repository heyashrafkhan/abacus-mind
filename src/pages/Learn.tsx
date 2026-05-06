import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star, ChevronRight } from 'lucide-react';
import { levels, getLessonsByLevel } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';

export default function Learn() {
  const [activeLevel, setActiveLevel] = useState(1);
  const { progress } = useProgress();

  const levelLessons = getLessonsByLevel(activeLevel);
  const levelInfo = levels.find(l => l.id === activeLevel)!;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-fredoka text-3xl text-text-dark">Learning Path</h2>
        <p className="text-text-medium">Pick a level and start your abacus adventure!</p>
      </div>

      {/* Level Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {levels.map(level => {
          const isLocked = level.id > progress.level;
          const isActive = level.id === activeLevel;
          return (
            <button
              key={level.id}
              onClick={() => !isLocked && setActiveLevel(level.id)}
              disabled={isLocked}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'bg-white shadow-md border-2 border-primary text-primary'
                  : isLocked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-text-medium hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Star className="w-4 h-4" style={{ color: isActive ? level.color : undefined }} />}
              {level.name}
            </button>
          );
        })}
      </div>

      {/* Level Info */}
      <motion.div
        key={activeLevel}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: levelInfo.color }}
          >
            {activeLevel}
          </div>
          <div>
            <h3 className="font-fredoka text-xl text-text-dark">{levelInfo.name}</h3>
            <p className="text-text-light text-sm">{levelInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Lessons List */}
      <div className="space-y-3">
        {levelLessons.map((lesson, idx) => {
          const lp = progress.lessonsProgress[lesson.id];
          const isCompleted = lp?.completed;
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                to={`/learn/${lesson.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-accent-green/10' : 'bg-gray-50'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-accent-green" />
                  ) : (
                    <span className="font-fredoka text-lg text-text-light">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-fredoka text-lg text-text-dark group-hover:text-primary transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-text-light text-sm truncate">{lesson.description}</p>
                </div>
                {isCompleted && lp && (
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-700">{Math.round(lp.score / 10)}</span>
                  </div>
                )}
                <ChevronRight className="w-5 h-5 text-text-light group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
