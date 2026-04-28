import React from 'react';

/**
 * @param {{ progress: number }} props
 */
export default function ProgressBar({ progress }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">Progress</span>
        <span className="text-xs text-muted-foreground font-mono font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}