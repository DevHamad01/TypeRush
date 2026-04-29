import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, RotateCcw, Play, Trophy, Square, Brain, Eye, Info, Lightbulb, BarChart3 } from 'lucide-react';
import { getRandomWords } from '@/utils/gameWords';
import { getProgress, saveProgress } from '@/utils/gameProgress';

const GAME_ID = 'flash_memory';
const MAX_LIVES = 3;

/** @type {Record<string, {wordCount: number, showMs: number, wordPool: 'easy'|'medium'|'hard', label: string, desc: string}>} */
const DIFFICULTY = {
  easy:   { wordCount: 1, showMs: 2500, wordPool: 'easy',   label: 'Easy',   desc: '1 word, 2.5s to memorize' },
  medium: { wordCount: 2, showMs: 1800, wordPool: 'medium', label: 'Medium', desc: '2 words, 1.8s to memorize' },
  hard:   { wordCount: 3, showMs: 1200, wordPool: 'hard',   label: 'Hard',   desc: '3 words, 1.2s to memorize' },
};

export default function FlashMemoryGame() {
  const [screen, setScreen] = useState('landing');
  const [difficulty, setDifficulty] = useState('medium');
  const [currentWords, setCurrentWords] = useState([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [round, setRound] = useState(1);
  const [input, setInput] = useState('');
  const [showPct, setShowPct] = useState(100);
  const [lastResult, setLastResult] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [roundsCleared, setRoundsCleared] = useState(0);
  const [progress, setProgress] = useState(getProgress(GAME_ID));

  const inputRef = useRef(null);
  const progressRef = useRef(null);
  const comboRef = useRef(combo);
  const livesRef = useRef(lives);
  comboRef.current = combo;
  livesRef.current = lives;

  const cfg = DIFFICULTY[difficulty];

  const wordPool = useCallback(() => {
    if (round <= 3) return 'easy';
    if (round <= 7) return 'medium';
    return 'hard';
  }, [round]);

  const showTime = useCallback(() => {
    return Math.max(600, cfg.showMs - Math.floor(round / 4) * 100);
  }, [cfg.showMs, round]);

  const beginRound = useCallback(() => {
    const words = getRandomWords(cfg.wordCount, wordPool());
    setCurrentWords(words);
    setInput('');
    setLastResult(null);
    setShowPct(100);
    setScreen('show');
  }, [cfg.wordCount, wordPool]);

  const startGame = useCallback(() => {
    setLives(MAX_LIVES); setScore(0); setCombo(0); setMaxCombo(0);
    setRound(1); setRoundsCleared(0); setInput('');
    setCountdown(3); setScreen('countdown');
    let c = 3;
    const cd = setInterval(() => { c--; setCountdown(c); if (c <= 0) { clearInterval(cd); } }, 1000);
  }, []);

  // After countdown, begin first round
  useEffect(() => {
    if (screen === 'countdown' && countdown <= 0) {
      const words = getRandomWords(cfg.wordCount, 'easy');
      setCurrentWords(words);
      setInput('');
      setLastResult(null);
      setShowPct(100);
      setScreen('show');
    }
  }, [screen, countdown, cfg.wordCount]);

  // Show phase timer
  useEffect(() => {
    if (screen !== 'show') return;
    cancelAnimationFrame(progressRef.current);
    const start = Date.now();
    const dur = showTime();
    setShowPct(100);
    const step = () => {
      const pct = Math.max(0, 100 - ((Date.now() - start) / dur) * 100);
      setShowPct(pct);
      if (pct > 0) progressRef.current = requestAnimationFrame(step);
      else { setScreen('type'); setTimeout(() => inputRef.current?.focus(), 50); }
    };
    progressRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(progressRef.current);
  }, [screen, currentWords, showTime]);

  const checkAnswer = useCallback(() => {
    const typed = input.trim().toLowerCase();
    const expected = currentWords.join(' ').toLowerCase();
    const correct = typed === expected;

    if (correct) {
      const pts = Math.round(100 * cfg.wordCount * (1 + comboRef.current * 0.2) * (round * 0.15 + 1));
      setScore(s => s + pts);
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
      setRoundsCleared(r => r + 1);
    } else {
      setCombo(0);
      setLives(l => Math.max(0, l - 1));
    }

    setLastResult(correct ? 'correct' : 'wrong');
    setScreen('result');
    setInput('');

    setTimeout(() => {
      if (!correct && livesRef.current <= 0) {
        setScreen('gameover');
        return;
      }
      setRound(r => r + 1);
    }, 800);
  }, [input, currentWords, cfg.wordCount, round]);

  // After round increment, start next round
  useEffect(() => {
    if (screen === 'result' && round > 1) {
      const timer = setTimeout(() => {
        if (livesRef.current > 0) beginRound();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [round, screen, beginRound]);

  const handleKeyDown = useCallback((e) => {
    if (screen === 'type' && e.key === 'Enter') { e.preventDefault(); checkAnswer(); }
  }, [screen, checkAnswer]);

  const stopGame = useCallback(() => setScreen('gameover'), []);

  useEffect(() => {
    if (screen === 'gameover') {
      saveProgress(GAME_ID, { score, maxCombo, round });
      setProgress(getProgress(GAME_ID));
    }
  }, [screen, score, maxCombo, round]);

  // ── LANDING ──
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="text-center space-y-2">
            <div className="text-6xl">🧠</div>
            <h1 className="text-4xl font-black">Flash Memory</h1>
            <p className="text-muted-foreground">Words flash briefly — memorize them, then type them back</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Info className="w-4 h-4 text-emerald-500" /> About</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A word (or multiple) appears on screen for a brief moment, then disappears.
              You must type exactly what you saw. Each correct answer scores points and builds your combo.
              The display time gets shorter as you progress through rounds.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Lightbulb className="w-4 h-4 text-yellow-500" /> Tips & Tricks</div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Say the word aloud as it appears — auditory memory helps</li>
              <li>• For multiple words, group them into a mental image</li>
              <li>• Type the answer and press Enter to submit</li>
              <li>• Display time decreases as rounds go on — stay focused!</li>
            </ul>
          </div>
          {progress.gamesPlayed > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold"><BarChart3 className="w-4 h-4 text-primary" /> Your Progress</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xl font-bold font-mono text-emerald-500">{progress.highScore.toLocaleString()}</p><p className="text-xs text-muted-foreground">High Score</p></div>
                <div><p className="text-xl font-bold font-mono">{progress.gamesPlayed}</p><p className="text-xs text-muted-foreground">Games Played</p></div>
                <div><p className="text-xl font-bold font-mono text-orange-500">x{progress.bestCombo}</p><p className="text-xs text-muted-foreground">Best Combo</p></div>
              </div>
            </div>
          )}
          <div className="space-y-3">
            <p className="text-sm font-bold text-center">Difficulty</p>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(DIFFICULTY).map(([key, d]) => (
                <button key={key} onClick={() => setDifficulty(key)}
                  className={`p-3 rounded-xl border text-center transition-all ${difficulty === key ? 'border-emerald-500 bg-emerald-500/15 text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
                >
                  <p className="font-bold text-sm">{d.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button onClick={startGame}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Play className="w-5 h-5" /> Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME ──
  return (
    <div className="h-screen bg-background text-foreground flex flex-col select-none overflow-hidden">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-border bg-card/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Flash Memory</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">Rd.{round}</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart key={i} className={`w-4 h-4 transition-all ${i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          <div className={`flex items-center gap-1 font-bold text-xs ${combo >= 5 ? 'text-orange-500' : 'text-emerald-500'}`}>
            <Zap className="w-3.5 h-3.5" />
            <span className="font-mono">x{combo}</span>
          </div>
          <div className="font-mono font-bold text-sm tabular-nums">{score.toLocaleString()}</div>
          {(screen === 'show' || screen === 'type') && (
            <button onClick={stopGame} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Square className="w-3 h-3" /> Stop
            </button>
          )}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center gap-8 px-4">
        {/* Round indicator */}
        {(screen === 'show' || screen === 'type' || screen === 'result') && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Round {round}</span>
            <span>·</span>
            <span className="capitalize">{wordPool()} words</span>
          </div>
        )}

        {/* Countdown */}
        {screen === 'countdown' && countdown > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
              className="text-[8rem] font-black text-emerald-500"
            >{countdown}</motion.div>
          </AnimatePresence>
        )}

        {/* SHOW phase */}
        {screen === 'show' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8 w-full max-w-lg">
            <div className="flex items-center gap-2 text-emerald-500">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Memorize!</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {currentWords.map((word, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                >{word}</motion.div>
              ))}
            </div>
            <div className="w-full max-w-sm h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-none" style={{ width: `${showPct}%` }} />
            </div>
          </motion.div>
        )}

        {/* TYPE phase */}
        {screen === 'type' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-8 w-full max-w-lg">
            <div className="flex items-center gap-2 text-primary">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Type what you saw!</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {currentWords.map((word, i) => (
                <div key={i} className="px-6 py-4 rounded-2xl bg-muted border border-border font-mono text-2xl font-bold text-muted-foreground/30">
                  {'_'.repeat(word.length)}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-3 w-full max-w-sm">
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                className="w-full px-5 py-3 rounded-xl bg-card border border-border text-foreground font-mono text-lg text-center focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 placeholder:text-muted-foreground/40 transition-all"
                placeholder={cfg.wordCount > 1 ? 'words separated by spaces' : 'type the word'}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
              />
              <button onClick={checkAnswer}
                className="w-full py-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >Submit (Enter)</button>
            </div>
          </motion.div>
        )}

        {/* Result flash */}
        {screen === 'result' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center gap-3">
            {lastResult === 'correct' ? (
              <>
                <div className="text-6xl">✅</div>
                <p className="text-xl font-bold text-green-500">Correct!</p>
              </>
            ) : (
              <>
                <div className="text-6xl">❌</div>
                <p className="text-xl font-bold text-red-500">Wrong!</p>
                <p className="text-sm text-muted-foreground">Answer: <span className="font-mono text-foreground">{currentWords.join(' ')}</span></p>
              </>
            )}
          </motion.div>
        )}

        {/* Game Over */}
        {screen === 'gameover' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
            <div className="text-center space-y-1">
              <h2 className="text-3xl font-black">Memory Faded</h2>
              <p className="text-muted-foreground">Round {round} · {roundsCleared} rounds cleared</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Score', value: score.toLocaleString(), accent: 'text-emerald-500' },
                { label: 'Max Combo', value: `x${maxCombo}`, accent: 'text-orange-500' },
                { label: 'Rounds', value: roundsCleared, accent: 'text-primary' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold font-mono ${s.accent}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all hover:scale-105">
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
              <Link to="/" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-bold transition-all hover:bg-muted">
                <Trophy className="w-4 h-4" /> Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
