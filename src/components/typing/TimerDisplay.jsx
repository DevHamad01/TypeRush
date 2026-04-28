import React from 'react';

/**
 * @param {{ timeLeft: number, duration: number, isStarted: boolean }} props
 */
export default function TimerDisplay({ timeLeft, duration, isStarted }) {
  const percentage = (timeLeft / duration) * 100;
  const isLow = timeLeft <= 10;
  const isMedium = timeLeft <= 20;

  const colorClass = isLow
    ? 'text-incorrect'
    : isMedium
    ? 'text-yellow-500'
    : 'text-foreground';

  const barColor = isLow
    ? 'bg-destructive'
    : isMedium
    ? 'bg-yellow-500'
    : 'bg-primary';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`font-mono text-5xl font-bold tabular-nums transition-colors duration-300 ${colorClass} ${isLow && isStarted ? 'animate-pulse' : ''}`}>
        {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
      </div>
      <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}