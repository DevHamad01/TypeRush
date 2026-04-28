import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Target, AlertCircle, Clock, RotateCcw, FileText, Trophy, TrendingUp, LogIn, ChevronRight } from 'lucide-react';
import { useFirebaseAuth } from '@/lib/FirebaseAuthContext';

/**
 * @param {{ target: number, suffix?: string, duration?: number }} props
 */
function AnimatedNumber({ target, suffix = '', duration = 1500 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{value}{suffix}</span>;
}

/**
 * @param {{ icon: React.ElementType, label: string, value: number, suffix?: string, color: {bg: string, icon: string, text: string}, delay?: number }} props
 */
function ResultCard({ icon: Icon, label, value, suffix = '', color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="stat-card-glow bg-card rounded-2xl p-6 text-center space-y-2"
    >
      <div className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center ${color.bg}`}>
        <Icon className={`w-6 h-6 ${color.icon}`} />
      </div>
      <p className={`text-4xl font-bold font-mono ${color.text}`}>
        <AnimatedNumber target={value} suffix={suffix} />
      </p>
      <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

/**
 * @param {number} wpm 
 * @param {number} accuracy 
 */
function getPerformanceLabel(wpm, accuracy) {
  if (wpm >= 100 && accuracy >= 97) return { label: 'Legendary Typist! 🏆', color: 'text-yellow-500' };
  if (wpm >= 80 && accuracy >= 95) return { label: 'Expert Typist! ⭐', color: 'text-primary' };
  if (wpm >= 60 && accuracy >= 90) return { label: 'Advanced Typist! 🚀', color: 'text-correct' };
  if (wpm >= 40 && accuracy >= 85) return { label: 'Good Progress! 👍', color: 'text-foreground' };
  return { label: 'Keep Practicing! 💪', color: 'text-muted-foreground' };
}

/**
 * @param {{ wpm: number, accuracy: number, mistakes: number, duration: number, onRetry: () => void, onNewText: () => void }} props
 */
export default function ResultScreen({ wpm, accuracy, mistakes, duration, onRetry, onNewText }) {
  const performance = getPerformanceLabel(wpm, accuracy);
  const charsTyped = Math.round((wpm * 5 * duration) / 60);
  const { isAuthenticated } = useFirebaseAuth();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Test Complete!</h2>
        <p className={`text-lg font-semibold ${performance.color}`}>{performance.label}</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-4">
        <ResultCard
          icon={Zap}
          label="WPM"
          value={wpm}
          color={{ bg: 'bg-primary/10', icon: 'text-primary', text: 'text-primary' }}
          delay={0.1}
        />
        <ResultCard
          icon={Target}
          label="Accuracy"
          value={accuracy}
          suffix="%"
          color={{
            bg: accuracy >= 90 ? 'bg-green-500/10' : 'bg-yellow-500/10',
            icon: accuracy >= 90 ? 'text-green-500' : 'text-yellow-500',
            text: accuracy >= 90 ? 'text-correct' : 'text-yellow-500'
          }}
          delay={0.2}
        />
        <ResultCard
          icon={AlertCircle}
          label="Errors"
          value={mistakes}
          color={{
            bg: mistakes === 0 ? 'bg-green-500/10' : 'bg-destructive/10',
            icon: mistakes === 0 ? 'text-green-500' : 'text-destructive',
            text: mistakes === 0 ? 'text-correct' : 'text-incorrect'
          }}
          delay={0.3}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-muted/50 rounded-2xl p-5 flex items-center justify-around"
      >
        <div className="text-center">
          <p className="text-2xl font-bold font-mono">{duration}s</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Duration</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-bold font-mono">~{charsTyped}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Chars Typed</p>
        </div>
        <div className="w-px h-10 bg-border" />
        <div className="text-center">
          <p className="text-2xl font-bold font-mono text-correct">{Math.max(0, charsTyped - mistakes * 2)}</p>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">Correct</p>
        </div>
      </motion.div>

      {/* Save Results Nudge for logged-out users */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex items-center justify-between gap-4 bg-primary/8 border border-primary/20 rounded-2xl px-5 py-4"
        >
          <div className="space-y-0.5">
            <p className="text-sm font-bold">Save your results</p>
            <p className="text-xs text-muted-foreground">Sign in to track progress & unlock achievements</p>
          </div>
          <Link
            to="/signin"
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
            <ChevronRight className="w-3 h-3" />
          </Link>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex gap-3"
      >
        <button
          onClick={onRetry}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <button
          onClick={onNewText}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border bg-card text-foreground font-bold text-base transition-all hover:bg-secondary hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileText className="w-4 h-4" />
          New Text
        </button>
      </motion.div>
    </div>
  );
}