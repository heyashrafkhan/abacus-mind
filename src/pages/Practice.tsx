import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Play, Pause, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import Abacus from '../components/Abacus';
import { useProgress } from '../context/ProgressContext';

interface Problem {
  a: number;
  b: number;
  op: '+' | '-';
  answer: number;
}

function generateProblem(maxVal: number): Problem {
  const op = Math.random() > 0.5 ? '+' : '-';
  let a = Math.floor(Math.random() * maxVal) + 1;
  let b = Math.floor(Math.random() * maxVal) + 1;
  if (op === '-' && b > a) [a, b] = [b, a];
  return { a, b, op, answer: op === '+' ? a + b : a - b };
}

export default function Practice() {
  const { addXp, updateAccuracy, incrementProblems, progress } = useProgress();
  const [mode, setMode] = useState<'free' | 'challenge' | 'mental'>('free');
  const [difficulty, setDifficulty] = useState(9); // max digit value
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [hideAbacus, setHideAbacus] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Visual Fading Logic: Opacity decreases based on current streak in Mental mode
  const getAbacusOpacity = () => {
    if (mode !== 'mental') return 1;
    if (streak === 0) return 1;
    // Decrease opacity by 20% every 3 correct answers, minimum 0.1
    const fade = Math.max(0.1, 1 - (Math.floor(streak / 3) * 0.2));
    return fade;
  };

  // Timer
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const startChallenge = useCallback(() => {
    setScore(0);
    setTotal(0);
    setTimer(0);
    setStreak(0);
    setRunning(true);
    setFeedback('none');
    nextProblem();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const nextProblem = useCallback(() => {
    const p = generateProblem(difficulty);
    setProblem(p);
    setUserAnswer(0);
    setFeedback('none');
  }, [difficulty]);

  const checkAnswer = useCallback(() => {
    if (!problem || feedback !== 'none') return;
    const correct = userAnswer === problem.answer;
    setFeedback(correct ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    incrementProblems();
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const newStreak = s + 1;
        setBestStreak(b => Math.max(b, newStreak));
        return newStreak;
      });
      addXp(10);
      if (soundOn) {
        // Simple beep using Web Audio API
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 600;
          gain.gain.value = 0.1;
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } catch { /* ignore audio errors */ }
      }
    } else {
      setStreak(0);
    }
    updateAccuracy(correct ? 1 : 0, 1);
  }, [problem, userAnswer, feedback, soundOn, addXp, updateAccuracy, incrementProblems]);

  const handleNext = () => {
    if (mode === 'challenge' && total >= 9) {
      setRunning(false);
    }
    nextProblem();
    setFeedback('none');
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="font-fredoka text-3xl text-text-dark">Practice Studio</h2>
        <p className="text-text-medium">Train your abacus skills with custom exercises.</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-100">
        {[
          { id: 'free', label: 'Free Play' },
          { id: 'challenge', label: 'Challenge (10)' },
          { id: 'mental', label: 'Mental Math' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id as any);
              setRunning(false);
              setProblem(null);
              setFeedback('none');
              if (m.id === 'mental') setHideAbacus(true);
              if (m.id !== 'mental') setHideAbacus(false);
            }}
            className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-colors ${
              mode === m.id ? 'bg-primary text-white' : 'text-text-medium hover:bg-gray-50'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Difficulty & Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-100">
          <span className="text-sm text-text-light font-bold">Max:</span>
          {[9, 20, 50, 99].map(d => (
            <button
              key={d}
              onClick={() => { setDifficulty(d); setProblem(null); setRunning(false); }}
              className={`px-2 py-1 rounded-lg text-sm font-bold transition-colors ${
                difficulty === d ? 'bg-primary text-white' : 'bg-gray-50 text-text-medium hover:bg-gray-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSoundOn(!soundOn)}
          className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
          aria-label="Toggle sound"
        >
          {soundOn ? <Volume2 className="w-5 h-5 text-text-medium" /> : <VolumeX className="w-5 h-5 text-text-light" />}
        </button>

        <button
          onClick={() => setHideAbacus(!hideAbacus)}
          className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
          aria-label="Toggle abacus visibility"
        >
          {hideAbacus ? <EyeOff className="w-5 h-5 text-text-medium" /> : <Eye className="w-5 h-5 text-text-medium" />}
        </button>

        {mode === 'challenge' && (
          <button
            onClick={running ? () => setRunning(false) : startChallenge}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-colors ${
              running ? 'bg-red-50 text-accent-red hover:bg-red-100' : 'bg-green-50 text-accent-green hover:bg-green-100'
            }`}
          >
            {running ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Start Challenge</>}
          </button>
        )}

        {mode === 'free' && (
          <button
            onClick={nextProblem}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-xl font-bold hover:bg-blue-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> New Problem
          </button>
        )}
      </div>

      {/* Challenge Stats */}
      {mode === 'challenge' && running && (
        <div className="flex gap-3">
          <StatPill label="Time" value={formatTime(timer)} bg="bg-amber-50 text-amber-700 border-amber-200" />
          <StatPill label="Score" value={`${score}/${total}`} bg="bg-green-50 text-accent-green border-green-200" />
          <StatPill label="Streak" value={`${streak} 🔥`} bg="bg-orange-50 text-secondary border-orange-200" />
        </div>
      )}

      {/* Problem Area */}
      <AnimatePresence mode="wait">
        {mode === 'free' && !problem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 text-center border border-gray-100"
          >
            <p className="text-text-light text-lg">Click "New Problem" to start practicing!</p>
            <p className="text-text-medium mt-2">Use the abacus to solve addition and subtraction problems.</p>
          </motion.div>
        ) : (
          problem && (
            <motion.div
              key={problem.a + problem.op + problem.b}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Problem Card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="font-fredoka text-4xl sm:text-5xl text-text-dark mb-4">
                  {problem.a} {problem.op} {problem.b} = ?
                </div>

                {/* Answer Display */}
                <div className="inline-block bg-blue-50 rounded-2xl px-8 py-4 min-w-[120px]">
                  <span className="text-text-light text-sm font-bold">Your Answer</span>
                  <div className="font-fredoka text-4xl text-primary">{userAnswer}</div>
                </div>
              </div>

              {/* Abacus (unless hidden for mental mode) */}
              {!hideAbacus && (
                <div className={`bg-white rounded-2xl p-4 border border-gray-100 transition-opacity ${mode === 'mental' ? 'opacity-100' : ''}`}>
                  <Abacus
                    numRods={difficulty >= 10 ? 2 : 1}
                    value={userAnswer}
                    onChange={setUserAnswer}
                    interactive
                    opacity={getAbacusOpacity()}
                  />
                  {mode === 'mental' && (
                    <div className="text-center space-y-1 mt-2">
                      <p className="text-xs text-text-light font-bold">Mental Mode: Visual Fade Active</p>
                      <p className="text-[10px] text-text-light/60 italic">
                        Abacus fades as your streak grows. Focus on the image in your mind!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mental Input (when abacus hidden) */}
              {hideAbacus && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <p className="text-center text-text-medium font-bold mb-4">Mental Math Mode - Visualize the abacus in your mind!</p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-sm mx-auto">
                    {[1,2,3,4,5,6,7,8,9,0].map(n => (
                      <button
                        key={n}
                        onClick={() => setUserAnswer(prev => prev * 10 + n)}
                        className="h-14 bg-gray-50 hover:bg-primary hover:text-white rounded-xl font-fredoka text-xl font-bold transition-colors"
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      onClick={() => setUserAnswer(0)}
                      className="h-14 bg-red-50 hover:bg-accent-red hover:text-white rounded-xl font-bold transition-colors text-accent-red"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback */}
              {feedback !== 'none' && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`text-center p-4 rounded-2xl font-bold text-lg ${
                    feedback === 'correct' ? 'bg-green-50 text-accent-green' : 'bg-red-50 text-accent-red'
                  }`}
                >
                  {feedback === 'correct' ? (
                    <span>🎉 Correct! Great job!</span>
                  ) : (
                    <span>The answer was {problem.answer}. Keep practicing!</span>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-3">
                {feedback === 'none' ? (
                  <button
                    onClick={checkAnswer}
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-primary/25"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="bg-secondary hover:bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold text-lg transition-colors"
                  >
                    {mode === 'challenge' && total >= 10 ? 'Finish' : 'Next Problem'}
                  </button>
                )}
              </div>
            </motion.div>
          )
        )}
      </AnimatePresence>

      {/* Challenge Finished */}
      {mode === 'challenge' && !running && total >= 10 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 text-center border border-gray-100"
        >
          <h3 className="font-fredoka text-3xl text-text-dark mb-2">Challenge Complete!</h3>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto my-6">
            <div className="bg-blue-50 rounded-xl p-3">
              <div className="text-2xl font-fredoka text-primary">{score}/10</div>
              <div className="text-xs text-text-light font-bold">Score</div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3">
              <div className="text-2xl font-fredoka text-amber-600">{formatTime(timer)}</div>
              <div className="text-xs text-text-light font-bold">Time</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-3">
              <div className="text-2xl font-fredoka text-secondary">{bestStreak}</div>
              <div className="text-xs text-text-light font-bold">Best Streak</div>
            </div>
          </div>
          <button
            onClick={startChallenge}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}

function StatPill({ label, value, bg }: { label: string; value: string; bg: string }) {
  return (
    <div className={`px-4 py-2 rounded-xl border font-bold text-sm ${bg}`}>
      <span className="opacity-70 mr-1">{label}:</span>
      {value}
    </div>
  );
}
