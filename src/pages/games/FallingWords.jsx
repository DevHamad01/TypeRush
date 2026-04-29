import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, RotateCcw, Play, Trophy, Square, Info, Lightbulb, BarChart3 } from 'lucide-react';
import { getRandomWord } from '@/utils/gameWords';
import { getProgress, saveProgress } from '@/utils/gameProgress';

const GAME_ID = 'falling_words';
const LANE_COUNT = 6;
const MAX_LIVES = 3;
const LEVEL_EVERY_SEC = 20;

/** @type {Record<string, {fallSpeed: number, speedInc: number, spawnMs: number, wordPool: 'easy'|'medium'|'hard', label: string, desc: string}>} */
const DIFFICULTY = {
  easy:   { fallSpeed: 0.04, speedInc: 0.005, spawnMs: 2800, wordPool: 'easy',   label: 'Easy',   desc: 'Slow fall, simple words' },
  medium: { fallSpeed: 0.06, speedInc: 0.008, spawnMs: 2200, wordPool: 'medium', label: 'Medium', desc: 'Balanced speed & words' },
  hard:   { fallSpeed: 0.09, speedInc: 0.012, spawnMs: 1600, wordPool: 'hard',   label: 'Hard',   desc: 'Fast fall, complex words' },
};

let wid = 0;

export default function FallingWordsGame() {
  const [screen, setScreen] = useState('landing');
  const [difficulty, setDifficulty] = useState('medium');
  const [words, setWords] = useState([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [floats, setFloats] = useState([]);
  const [cleared, setCleared] = useState(0);
  const [progress, setProgress] = useState(getProgress(GAME_ID));

  const inputRef = useRef(null);
  const animRef = useRef(null);
  const spawnRef = useRef(null);
  const levelRef = useRef(null);
  const livesRef = useRef(lives);
  const levelValRef = useRef(level);
  const comboRef = useRef(combo);
  const wordsRef = useRef(words);

  livesRef.current = lives;
  levelValRef.current = level;
  comboRef.current = combo;
  wordsRef.current = words;

  const cfg = DIFFICULTY[difficulty];

  const addFloat = useCallback((text, x, y, color) => {
    const id = Date.now() + Math.random();
    setFloats(p => [...p, { id, text, x, y, color }]);
    setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 900);
  }, []);

  const spawnWord = useCallback(() => {
    const pool = levelValRef.current <= 3 ? cfg.wordPool : (levelValRef.current <= 6 ? 'medium' : 'hard');
    const word = getRandomWord(pool);
    const lane = Math.floor(Math.random() * LANE_COUNT);
    wid++;
    setWords(p => [...p, { id: wid, word, top: -5, left: (lane / LANE_COUNT) * 82 + 4, typed: '' }]);
  }, [cfg.wordPool]);

  const startLoop = useCallback(() => {
    const loop = () => {
      const spd = cfg.fallSpeed + (levelValRef.current - 1) * cfg.speedInc;
      setWords(prev => {
        let hit = 0;
        const next = prev.map(w => {
          const nt = w.top + spd;
          if (nt >= 90) { hit++; return null; }
          return { ...w, top: nt };
        }).filter(Boolean);
        if (hit > 0) {
          setLives(l => { const nl = Math.max(0, l - hit); if (nl <= 0) setScreen('gameover'); return nl; });
          setCombo(0);
          setShake(true);
          setTimeout(() => setShake(false), 300);
        }
        return next;
      });
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, [cfg]);

  const handleInput = useCallback((e) => {
    if (screen !== 'playing') return;
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    const current = wordsRef.current;
    const sorted = [...current].sort((a, b) => b.top - a.top);
    const target = sorted.find(w => w.word.startsWith(val) && val.length > 0);

    if (target && val === target.word) {
      const pts = Math.round(target.word.length * 10 * (1 + comboRef.current * 0.1) * (1 + (90 - target.top) / 200));
      setScore(s => s + pts);
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
      setCleared(w => w + 1);
      addFloat(`+${pts}`, target.left, target.top, 'hsl(var(--primary))');
      setWords(p => p.filter(w => w.id !== target.id));
      setInput('');
      e.target.value = '';
      return;
    }

    setInput(val);
    setWords(p => p.map(w => {
      if (target && w.id === target.id) return { ...w, typed: val };
      return { ...w, typed: '' };
    }));
  }, [screen, addFloat]);

  const startGame = useCallback(() => {
    setWords([]); setLives(MAX_LIVES); setScore(0); setCombo(0); setMaxCombo(0);
    setLevel(1); setInput(''); setCleared(0); setCountdown(3); setScreen('countdown');
    let c = 3;
    const cd = setInterval(() => { c--; setCountdown(c); if (c <= 0) { clearInterval(cd); setScreen('playing'); } }, 1000);
  }, []);

  const stopGame = useCallback(() => { setScreen('gameover'); }, []);

  useEffect(() => {
    if (screen === 'playing') {
      startLoop();
      spawnRef.current = setInterval(spawnWord, cfg.spawnMs);
      spawnWord();
      levelRef.current = setInterval(() => setLevel(l => l + 1), LEVEL_EVERY_SEC * 1000);
      inputRef.current?.focus();
    }
    return () => { cancelAnimationFrame(animRef.current); clearInterval(spawnRef.current); clearInterval(levelRef.current); };
  }, [screen, startLoop, spawnWord, cfg.spawnMs]);

  useEffect(() => {
    if (screen !== 'playing') return;
    clearInterval(spawnRef.current);
    const ms = Math.max(600, cfg.spawnMs - (level - 1) * 120);
    spawnRef.current = setInterval(spawnWord, ms);
    return () => clearInterval(spawnRef.current);
  }, [level, screen, spawnWord, cfg.spawnMs]);

  useEffect(() => {
    if (screen === 'gameover') {
      saveProgress(GAME_ID, { score, maxCombo, level });
      setProgress(getProgress(GAME_ID));
    }
  }, [screen, score, maxCombo, level]);

  const wordColor = (top) => {
    if (top >= 65) return 'border-red-500/60 bg-red-500/10 text-red-400';
    if (top >= 40) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
    return 'border-purple-500/40 bg-purple-500/10 text-foreground/70';
  };

  // ── LANDING ──
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="text-center space-y-2">
            <div className="text-6xl">🌧️</div>
            <h1 className="text-4xl font-black">Falling Words</h1>
            <p className="text-muted-foreground">Type the words before they reach the danger zone</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Info className="w-4 h-4 text-purple-500" /> About</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Words fall from the sky at increasing speed. Type each word and it auto-completes. Miss 3 words and it's game over.
              Build combos by typing consecutive words without mistakes. The longer you survive, the harder it gets.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Lightbulb className="w-4 h-4 text-yellow-500" /> Tips & Tricks</div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Prioritize words near the bottom (red/yellow) — they're about to hit</li>
              <li>• Just type the word — input clears automatically on match</li>
              <li>• Longer words give more points, especially when cleared early</li>
              <li>• Keep your combo alive for score multipliers up to x5</li>
            </ul>
          </div>
          {progress.gamesPlayed > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold"><BarChart3 className="w-4 h-4 text-primary" /> Your Progress</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xl font-bold font-mono text-primary">{progress.highScore.toLocaleString()}</p><p className="text-xs text-muted-foreground">High Score</p></div>
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
                  className={`p-3 rounded-xl border text-center transition-all ${difficulty === key ? 'border-purple-500 bg-purple-500/15 text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
                >
                  <p className="font-bold text-sm">{d.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button onClick={startGame}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Play className="w-5 h-5" /> Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME + GAMEOVER ──
  return (
    <div className="h-screen bg-background text-foreground flex flex-col select-none overflow-hidden">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-border bg-card/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"><ArrowLeft className="w-4 h-4" /></Link>
          <span className="text-sm font-bold text-purple-500 uppercase tracking-wider">Falling Words</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 text-xs font-bold">Lv.{level}</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Heart key={i} className={`w-4 h-4 transition-all ${i < lives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          <div className={`flex items-center gap-1 font-bold text-sm ${combo >= 5 ? 'text-orange-500' : 'text-purple-500'}`}>
            <Zap className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">x{(1 + combo * 0.1).toFixed(1)}</span>
            {combo >= 3 && <span className="text-xs">🔥</span>}
          </div>
          <div className="font-mono font-bold text-sm tabular-nums">{score.toLocaleString()}</div>
          {screen === 'playing' && (
            <button onClick={stopGame} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Square className="w-3 h-3" /> Stop
            </button>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className={`relative flex-1 overflow-hidden ${shake ? 'animate-[shake_0.3s_ease]' : ''}`}>
        {/* Danger line */}
        <div className="absolute bottom-[10%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent z-10" />
        <div className="absolute bottom-[10%] left-0 right-0 h-6 bg-gradient-to-t from-red-500/8 to-transparent z-10 pointer-events-none" />
        <p className="absolute bottom-[10%] right-3 text-red-500/40 text-[10px] font-bold uppercase tracking-widest translate-y-[-50%] z-10">danger</p>

        {/* Words */}
        {words.map(w => (
          <div key={w.id} className="absolute pointer-events-none z-10 transition-none" style={{ top: `${w.top}%`, left: `${w.left}%` }}>
            <div className={`px-2.5 py-1 rounded-lg font-mono font-bold text-sm border ${wordColor(w.top)} ${w.typed ? 'shadow-md' : ''}`}>
              <span className="text-primary">{w.typed}</span>
              <span>{w.word.slice(w.typed.length)}</span>
            </div>
          </div>
        ))}

        {/* Floats */}
        {floats.map(f => (
          <div key={f.id} className="absolute pointer-events-none z-20 font-bold text-sm animate-[floatUp_0.9s_ease_forwards] text-primary"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >{f.text}</div>
        ))}

        {/* Input */}
        {screen === 'playing' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
            <input ref={inputRef} value={input} onChange={handleInput}
              className="w-56 px-4 py-2 rounded-xl bg-card border border-border text-foreground font-mono text-base text-center focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40 transition-all"
              placeholder="type here..." autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            />
          </div>
        )}

        {/* Countdown */}
        {screen === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                className="text-[8rem] font-black text-purple-500"
              >{countdown || 'GO!'}</motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Game Over */}
        {screen === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-30 bg-background/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1">
              <h2 className="text-3xl font-black">Game Over</h2>
              <p className="text-muted-foreground">Level {level} · {cleared} words cleared</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-4">
              {[
                { label: 'Score', value: score.toLocaleString(), accent: 'text-purple-500' },
                { label: 'Max Combo', value: `x${maxCombo}`, accent: 'text-orange-500' },
                { label: 'Words', value: cleared, accent: 'text-green-500' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold font-mono ${s.accent}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3">
              <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all hover:scale-105">
                <RotateCcw className="w-4 h-4" /> Play Again
              </button>
              <Link to="/" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card text-foreground font-bold transition-all hover:bg-muted">
                <Trophy className="w-4 h-4" /> Home
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
