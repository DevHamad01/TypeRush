import React from 'react';
import { Keyboard, Sun, Moon, RotateCcw } from 'lucide-react';

export default function Header({ isDark, onToggleTheme, onRestart, showRestart }) {
  return (
    <header className="flex items-center justify-between py-5 px-2">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Keyboard className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight">TypeRush</span>
          <span className="text-primary text-xl font-bold">.</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {showRestart && (
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:block">Restart</span>
          </button>
        )}
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}