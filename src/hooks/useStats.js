import { useState, useCallback } from 'react';
import { ACHIEVEMENTS } from '@/lib/achievements';

const STORAGE_KEY = 'typerush-stats';

const DEFAULT_STATS = {
  totalTests: 0,
  totalChars: 0,
  bestWpm: 0,
  bestAccuracy: 0,
  perfectTests: 0,
  hardModeTests: 0,
  unlockedAchievements: [],
};

export function useStats() {
  const [stats, setStats] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_STATS, ...JSON.parse(stored) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  /** @param {any} newStats */
  const saveStats = (newStats) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
    setStats(newStats);
  };

  const recordResult = useCallback((/** @type {{ wpm: number, accuracy: number, mistakes: number, charsTyped: number, difficulty: string }} */ { wpm, accuracy, mistakes, charsTyped, difficulty }) => {
    setStats((/** @type {any} */ prev) => {
      const updated = {
        ...prev,
        totalTests: prev.totalTests + 1,
        totalChars: prev.totalChars + charsTyped,
        bestWpm: Math.max(prev.bestWpm, wpm),
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        perfectTests: mistakes === 0 ? prev.perfectTests + 1 : prev.perfectTests,
        hardModeTests: difficulty === 'hard' ? prev.hardModeTests + 1 : prev.hardModeTests,
        unlockedAchievements: [...prev.unlockedAchievements],
      };

      // Check for newly unlocked achievements
      const newlyUnlocked = [];
      for (const achievement of ACHIEVEMENTS) {
        if (!updated.unlockedAchievements.includes(achievement.id) && achievement.check(updated)) {
          updated.unlockedAchievements.push(achievement.id);
          newlyUnlocked.push(achievement);
        }
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { ...updated, _newlyUnlocked: newlyUnlocked };
    });
  }, []);

  const resetStats = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStats(DEFAULT_STATS);
  }, []);

  return { stats, saveStats, recordResult, resetStats };
}
