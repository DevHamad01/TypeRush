import React from 'react';
import { Zap, Target, AlertCircle } from 'lucide-react';

/**
 * @param {{ icon: React.ElementType, label: string, value: number | string, colorClass?: string }} props
 */
function StatItem({ icon: Icon, label, value, colorClass = 'text-primary' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
        <Icon className={`w-4 h-4 ${colorClass}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className={`text-xl font-bold font-mono ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}

/**
 * @param {{ wpm: number, accuracy: number, mistakes: number, isStarted: boolean }} props
 */
export default function LiveStats({ wpm, accuracy, mistakes, isStarted }) {
  return (
    <div className="flex items-center justify-center gap-8 md:gap-16">
      <StatItem
        icon={Zap}
        label="WPM"
        value={isStarted ? wpm : '—'}
        colorClass="text-primary"
      />
      <div className="w-px h-10 bg-border" />
      <StatItem
        icon={Target}
        label="Accuracy"
        value={isStarted ? `${accuracy}%` : '—'}
        colorClass={accuracy >= 90 ? 'text-correct' : accuracy >= 75 ? 'text-primary' : 'text-incorrect'}
      />
      <div className="w-px h-10 bg-border" />
      <StatItem
        icon={AlertCircle}
        label="Errors"
        value={isStarted ? mistakes : '—'}
        colorClass={mistakes === 0 ? 'text-muted-foreground' : 'text-incorrect'}
      />
    </div>
  );
}