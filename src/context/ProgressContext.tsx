import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface LessonProgress {
  id: string;
  completed: boolean;
  score: number;
  bestTime?: number;
}

export interface UserProgress {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak: number;
  totalProblemsSolved: number;
  accuracy: number;
  lessonsProgress: Record<string, LessonProgress>;
  badges: string[];
  lastPracticeDate: string | null;
}

const defaultProgress = (id: string, name: string): UserProgress => ({
  id,
  name,
  xp: 0,
  level: 1,
  streak: 0,
  totalProblemsSolved: 0,
  accuracy: 0,
  lessonsProgress: {},
  badges: [],
  lastPracticeDate: null,
});

interface ProgressState {
  profiles: Record<string, UserProgress>;
  activeProfileId: string | null;
}

interface ProgressContextType {
  progress: UserProgress | null;
  profiles: UserProgress[];
  setActiveProfile: (id: string) => void;
  createProfile: (name: string) => string;
  deleteProfile: (id: string) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, score: number, time?: number) => void;
  addBadge: (badgeId: string) => void;
  updateAccuracy: (correct: number, total: number) => void;
  incrementProblems: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    const saved = localStorage.getItem('abacus_profiles');
    if (!saved) return { profiles: {}, activeProfileId: null };
    
    try {
      const parsed = JSON.parse(saved);
      const migratedProfiles = { ...parsed.profiles };
      
      Object.keys(migratedProfiles).forEach(key => {
        const profile = migratedProfiles[key];
        if (!profile.id) {
          profile.id = key;
        }
      });

      return {
        profiles: migratedProfiles,
        activeProfileId: parsed.activeProfileId
      };
    } catch (e) {

      console.error("Failed to parse profiles:", e);
      return { profiles: {}, activeProfileId: null };
    }
  });

  useEffect(() => {
    localStorage.setItem('abacus_profiles', JSON.stringify(state));
  }, [state]);

  const activeProfile = state.activeProfileId ? state.profiles[state.activeProfileId] : null;

  const setActiveProfile = useCallback((id: string) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
  }, []);

  const createProfile = useCallback((name: string) => {
    const id = `user_${Date.now()}`;
    setState(prev => ({
      ...prev,
      profiles: { ...prev.profiles, [id]: defaultProgress(id, name) },
      activeProfileId: id
    }));
    return id;
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setState(prev => {
      const { [id]: _, ...remainingProfiles } = prev.profiles;
      return {
        profiles: remainingProfiles,
        activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId
      };
    });
  }, []);

  const updateActiveProfile = useCallback((updates: Partial<UserProgress>) => {
    setState(prev => {
      if (!prev.activeProfileId) return prev;
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: { ...prev.profiles[prev.activeProfileId], ...updates }
        }
      };
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setState(prev => {
      if (!prev.activeProfileId) return prev;
      const profile = prev.profiles[prev.activeProfileId];
      const newXp = profile.xp + amount;
      const newLevel = Math.floor(newXp / 500) + 1;
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: { ...profile, xp: newXp, level: newLevel }
        }
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, score: number, time?: number) => {
    setState(prev => {
      if (!prev.activeProfileId) return prev;
      const profile = prev.profiles[prev.activeProfileId];
      const existing = profile.lessonsProgress[lessonId];
      const lessonProgress: LessonProgress = {
        id: lessonId,
        completed: true,
        score: existing ? Math.max(existing.score, score) : score,
        bestTime: existing && existing.bestTime
          ? Math.min(existing.bestTime, time ?? Infinity)
          : time,
      };
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: {
            ...profile,
            lessonsProgress: { ...profile.lessonsProgress, [lessonId]: lessonProgress },
            xp: profile.xp + Math.round(score / 10),
          }
        }
      };
    });
  }, []);

  const addBadge = useCallback((badgeId: string) => {
    setState(prev => {
      if (!prev.activeProfileId) return prev;
      const profile = prev.profiles[prev.activeProfileId];
      if (profile.badges.includes(badgeId)) return prev;
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: { ...profile, badges: [...profile.badges, badgeId] }
        }
      };
    });
  }, []);

  const updateAccuracy = useCallback((correct: number, total: number) => {
    setState(prev => {
      if (!prev.activeProfileId) return prev;
      const profile = prev.profiles[prev.activeProfileId];
      const newTotal = profile.totalProblemsSolved + total;
      const newCorrect = Math.round((profile.accuracy * profile.totalProblemsSolved) / 100) + correct;
      const newAccuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: { ...profile, accuracy: newAccuracy }
        }
      };
    });
  }, []);

  const incrementProblems = useCallback(() => {
    setState(prev => {
      if (!prev.activeProfileId) return prev;
      const profile = prev.profiles[prev.activeProfileId];
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId]: { ...profile, totalProblemsSolved: profile.totalProblemsSolved + 1 }
        }
      };
    });
  }, []);

  return (
    <ProgressContext.Provider value={{ 
      progress: activeProfile, 
      profiles: Object.values(state.profiles),
      setActiveProfile, 
      createProfile, 
      deleteProfile,
      addXp, 
      completeLesson, 
      addBadge, 
      updateAccuracy, 
      incrementProblems 
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
