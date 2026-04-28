import React from 'react';
import { Clock, Zap, Target } from 'lucide-react';

const TIME_OPTIONS = [15, 30, 60, 120];
const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', icon: '🌱', desc: 'Simple words' },
  { value: 'medium', label: 'Medium', icon: '⚡', desc: 'Mixed sentences' },
  { value: 'hard', label: 'Hard', icon: '🔥', desc: 'Technical text' },
];

/**
 * @param {{ duration: number, difficulty: string, onDurationChange: (duration: number) => void, onDifficultyChange: (difficulty: string) => void }} props
 */
export default function ModeSelector({ duration, difficulty, onDurationChange, onDifficultyChange }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Clock className="w-4 h-4" />
          <span>Duration</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIME_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => onDurationChange(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold font-mono transition-all duration-200 border
                ${duration === t
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          <Target className="w-4 h-4" />
          <span>Difficulty</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {DIFFICULTY_OPTIONS.map(d => (
            <button
              key={d.value}
              onClick={() => onDifficultyChange(d.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                ${difficulty === d.value
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                }`}
            >
              <span>{d.icon}</span>
              <span>{d.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}