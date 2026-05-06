import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lightbulb, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { getLessonById } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import Abacus from '../components/Abacus';

export default function LessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const lesson = getLessonById(lessonId!);
  const { completeLesson, addXp, addBadge } = useProgress();

  const [stepIndex, setStepIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <h2 className="font-fredoka text-2xl text-text-dark">Lesson not found</h2>
        <button onClick={() => navigate('/learn')} className="mt-4 text-primary font-bold">Go back</button>
      </div>
    );
  }

  const contentSteps = lesson.content;
  const isContentPhase = stepIndex < contentSteps.length;
  const currentStep = isContentPhase ? contentSteps[stepIndex] : null;
  const currentQuiz = !isContentPhase && quizIndex < lesson.quiz.length ? lesson.quiz[quizIndex] : null;
  const totalSteps = contentSteps.length + lesson.quiz.length;
  const currentOverall = stepIndex + quizIndex;
  const progressPercent = Math.round((currentOverall / totalSteps) * 100);

  const handleNext = () => {
    if (isContentPhase && stepIndex < contentSteps.length - 1) {
      setStepIndex(prev => prev + 1);
      setAbacusValue(0);
    } else if (isContentPhase) {
      setStepIndex(prev => prev + 1);
    } else if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex(prev => prev + 1);
      setFeedback('none');
      setSelectedOption(null);
      setAbacusValue(0);
    } else {
      // Finished
      const finalScore = Math.round(((quizScore + (feedback === 'correct' ? 1 : 0)) / lesson.quiz.length) * 100);
      completeLesson(lesson.id, finalScore);
      addXp(finalScore);
      if (finalScore === 100) addBadge('perfect_lesson');
      if (lesson.level === 1 && lesson.order === 1) addBadge('first_steps');
      setFinished(true);
    }
  };

  const checkAnswer = () => {
    if (!currentQuiz) return;
    let correct = false;

    if (currentQuiz.type === 'abacus_set') {
      correct = abacusValue === currentQuiz.targetValue;
    } else if (currentQuiz.type === 'multiple_choice') {
      correct = selectedOption === currentQuiz.correctOption;
    } else if (currentQuiz.type === 'mental' && currentQuiz.targetValue !== undefined) {
      correct = abacusValue === currentQuiz.targetValue;
    }

    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) setQuizScore(prev => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/learn')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-text-medium" />
        </button>
        <div className="flex-1">
          <h2 className="font-fredoka text-2xl text-text-dark">{lesson.title}</h2>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${finished ? 100 : progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {!finished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={isContentPhase ? `content-${stepIndex}` : `quiz-${quizIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Content Phase */}
            {isContentPhase && currentStep && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {currentStep.type === 'text' && (
                  <p className="text-lg text-text-dark leading-relaxed">{currentStep.text}</p>
                )}

                {currentStep.type === 'tip' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800">{currentStep.tipTitle}</h4>
                      <p className="text-amber-700">{currentStep.tipText}</p>
                    </div>
                  </div>
                )}

                {currentStep.type === 'abacus_demo' && (
                  <div className="space-y-4">
                    {currentStep.text && <p className="text-lg text-text-dark">{currentStep.text}</p>}
                    <div className="flex justify-center">
                      <Abacus
                        numRods={currentStep.demoValue !== undefined && currentStep.demoValue >= 10 ? 2 : 1}
                        value={currentStep.demoValue ?? 0}
                        interactive={false}
                      />
                    </div>
                  </div>
                )}

                {currentStep.type === 'interactive' && (
                  <div className="space-y-4">
                    {currentStep.instruction && (
                      <p className="text-lg text-text-dark font-bold">{currentStep.instruction}</p>
                    )}
                    <div className="flex justify-center">
                      <Abacus
                        numRods={currentStep.targetValue !== undefined && currentStep.targetValue >= 10 ? 2 : 1}
                        value={abacusValue}
                        onChange={setAbacusValue}
                        interactive
                      />
                    </div>
                    {currentStep.targetValue !== undefined && (
                      <div className="text-center">
                        {abacusValue === currentStep.targetValue ? (
                          <div className="inline-flex items-center gap-2 bg-green-50 text-accent-green px-4 py-2 rounded-xl font-bold">
                            <CheckCircle className="w-5 h-5" /> Perfect! Click Next to continue.
                          </div>
                        ) : (
                          <p className="text-text-light">Set the abacus to {currentStep.targetValue}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quiz Phase */}
            {!isContentPhase && currentQuiz && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    Question {quizIndex + 1} / {lesson.quiz.length}
                  </span>
                </div>
                <h3 className="font-fredoka text-xl text-text-dark mb-6">{currentQuiz.question}</h3>

                {currentQuiz.type === 'abacus_set' && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Abacus
                        numRods={currentQuiz.targetValue !== undefined && currentQuiz.targetValue >= 10 ? 2 : 1}
                        value={abacusValue}
                        onChange={setAbacusValue}
                        interactive
                      />
                    </div>
                    {feedback !== 'none' && (
                      <div className={`text-center p-3 rounded-xl font-bold ${
                        feedback === 'correct' ? 'bg-green-50 text-accent-green' : 'bg-red-50 text-accent-red'
                      }`}>
                        {feedback === 'correct' ? (
                          <span className="inline-flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Correct!</span>
                        ) : (
                          <span className="inline-flex items-center gap-2"><XCircle className="w-5 h-5" /> Not quite. The answer was {currentQuiz.targetValue}.</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {currentQuiz.type === 'multiple_choice' && currentQuiz.options && (
                  <div className="space-y-3">
                    {currentQuiz.options.map((opt, i) => (
                      <button
                        key={i}
                        disabled={feedback !== 'none'}
                        onClick={() => {
                          setSelectedOption(i);
                          checkAnswer();
                        }}
                        className={`w-full text-left px-5 py-4 rounded-xl font-bold text-lg border-2 transition-all ${
                          feedback !== 'none' && i === currentQuiz.correctOption
                            ? 'border-accent-green bg-green-50 text-accent-green'
                            : feedback !== 'none' && selectedOption === i && i !== currentQuiz.correctOption
                            ? 'border-accent-red bg-red-50 text-accent-red'
                            : selectedOption === i
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-100 hover:border-primary/30 bg-white text-text-dark'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation Button */}
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={isContentPhase && currentStep?.type === 'interactive' && currentStep.targetValue !== undefined && abacusValue !== currentStep.targetValue}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold text-lg transition-colors shadow-lg shadow-primary/25"
              >
                {isContentPhase && stepIndex < contentSteps.length ? 'Next' : feedback === 'none' ? 'Check Answer' : 'Next'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Completion Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl p-10 border border-gray-100 shadow-sm"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-accent-green" />
          </div>
          <h2 className="font-fredoka text-3xl text-text-dark mb-2">Lesson Complete!</h2>
          <p className="text-text-medium text-lg mb-6">Amazing work! You earned {Math.round((quizScore / lesson.quiz.length) * 100)} XP.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/learn')}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold transition-colors"
            >
              Back to Lessons
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="bg-secondary hover:bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold transition-colors"
            >
              Practice Now
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
