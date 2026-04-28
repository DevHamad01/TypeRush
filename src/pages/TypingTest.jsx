import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModeSelector from '@/components/typing/ModeSelector';
import TextDisplay from '@/components/typing/TextDisplay';
import TimerDisplay from '@/components/typing/TimerDisplay';
import LiveStats from '@/components/typing/LiveStats';
import ProgressBar from '@/components/typing/ProgressBar';
import ResultScreen from '@/components/typing/ResultScreen';
import { useTypingTest } from '@/hooks/useTypingTest';
import { useStats } from '@/hooks/useStats';
import AchievementToast from '@/components/achievements/AchievementToast';
import { RotateCcw, PlayCircle } from 'lucide-react';

export default function TypingTest() {
  const [screen, setScreen] = useState('setup');
  const [duration, setDuration] = useState(60);
  const [difficulty, setDifficulty] = useState('medium');
  const [newAchievements, setNewAchievements] = useState([]);

  const test = useTypingTest({ duration, difficulty });
  const { stats, recordResult } = useStats();

  const handleStart = () => {
    test.initTest();
    setScreen('test');
    // Auto-focus input after screen transition
    setTimeout(() => test.inputRef.current?.focus(), 100);
  };

  const handleRestart = () => {
    test.initTest();
    setScreen('test');
    // Auto-focus input after screen transition
    setTimeout(() => test.inputRef.current?.focus(), 100);
  };

  const handleNewText = () => {
    setScreen('setup');
  };

  useEffect(() => {
    if (test.isFinished && screen === 'test') {
      const charsTyped = test.typedChars.filter(c => c.status !== 'pending').length;
      recordResult({ wpm: test.wpm, accuracy: test.accuracy, mistakes: test.mistakes, charsTyped, difficulty });
      const timer = setTimeout(() => setScreen('result'), 300);
      return () => clearTimeout(timer);
    }
  }, [test.isFinished, screen]);

  useEffect(() => {
    if (stats._newlyUnlocked?.length) {
      setNewAchievements(stats._newlyUnlocked);
    }
  }, [stats._newlyUnlocked]);

  useEffect(() => {
    if (screen === 'test') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [screen]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <AchievementToast achievements={newAchievements} onDismiss={() => setNewAchievements([])} />
      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold">Typing Test</h1>
              <p className="text-muted-foreground text-lg">Configure your test and hit start</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 stat-card-glow">
              <ModeSelector
                duration={duration}
                difficulty={difficulty}
                onDurationChange={setDuration}
                onDifficultyChange={setDifficulty}
              />
            </div>

            <div className="text-center">
              <button
                onClick={handleStart}
                className="inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-primary text-primary-foreground text-lg font-bold transition-all hover:opacity-90 hover:scale-105 active:scale-95 shadow-2xl shadow-primary/25"
              >
                <PlayCircle className="w-6 h-6" />
                Start Typing Test
              </button>
              <p className="mt-3 text-sm text-muted-foreground">Press any key to begin once the test loads</p>
            </div>
          </motion.div>
        )}

        {screen === 'test' && (
          <motion.div
            key="test"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Typing Test</h2>
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </button>
            </div>

            {/* Timer */}
            <div className="bg-card border border-border rounded-2xl p-6 stat-card-glow">
              <TimerDisplay timeLeft={test.timeLeft} duration={duration} isStarted={test.isStarted} />
            </div>

            {/* Text Display */}
            <div
              className="bg-card border border-border rounded-2xl p-8 cursor-text stat-card-glow relative"
              onClick={() => test.inputRef.current?.focus()}
            >
              {!test.isStarted && (
                <p className="text-center text-muted-foreground text-sm mb-4 font-medium">
                  👆 Click here or start typing to begin
                </p>
              )}
              <TextDisplay
                typedChars={test.typedChars}
                currentIndex={test.currentIndex}
                shakeError={test.shakeError}
              />
              <input
                ref={test.inputRef}
                onChange={test.handleInput}
                onPaste={(e) => e.preventDefault()}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>

            <ProgressBar progress={Math.round(((duration - test.timeLeft) / duration) * 100)} />

            <div className="bg-card border border-border rounded-2xl p-6 stat-card-glow">
              <LiveStats wpm={test.wpm} accuracy={test.accuracy} mistakes={test.mistakes} isStarted={test.isStarted} />
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-xs font-mono">Backspace</kbd> to correct mistakes
            </p>
          </motion.div>
        )}

        {screen === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-4"
          >
            <ResultScreen
              wpm={test.wpm}
              accuracy={test.accuracy}
              mistakes={test.mistakes}
              duration={duration}
              onRetry={handleRestart}
              onNewText={handleNewText}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}