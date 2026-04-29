import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Zap, RotateCcw, Play, Trophy, Square, Shield, Info, Lightbulb, BarChart3 } from 'lucide-react';
import { getRandomWord } from '@/utils/gameWords';
import { getProgress, saveProgress } from '@/utils/gameProgress';

const GAME_ID = 'cyber_defender';
const MAX_LIVES = 3;

const DIFFICULTY = {
  easy:   { baseSp: 0.08, spawnMs: 2800, label: 'Easy',   desc: 'Slow enemies, simple words' },
  medium: { baseSp: 0.12, spawnMs: 2000, label: 'Medium', desc: 'Balanced speed & words' },
  hard:   { baseSp: 0.18, spawnMs: 1400, label: 'Hard',   desc: 'Fast enemies, hard words' },
};

/** @type {{type: string, emoji: string, pool: 'easy'|'medium'|'hard', speedMult: number, pts: number}[]} */
const TYPES = [
  { type: 'scout',  emoji: '🛸', pool: 'easy',   speedMult: 1.8, pts: 80  },
  { type: 'normal', emoji: '👾', pool: 'medium', speedMult: 1.0, pts: 150 },
  { type: 'tank',   emoji: '🤖', pool: 'hard',   speedMult: 0.55, pts: 300 },
  { type: 'boss',   emoji: '💀', pool: 'hard',   speedMult: 0.7,  pts: 500 },
];

let eid = 0;

function pickType(elapsed) {
  if (elapsed < 15) return TYPES[0];
  if (elapsed < 40) return Math.random() < 0.5 ? TYPES[0] : TYPES[1];
  if (elapsed < 80) return Math.random() < 0.35 ? TYPES[2] : TYPES[1];
  const r = Math.random();
  return r < 0.12 ? TYPES[3] : r < 0.4 ? TYPES[2] : TYPES[1];
}

export default function CyberDefenderGame() {
  const [screen, setScreen] = useState('landing');
  const [difficulty, setDifficulty] = useState('medium');
  const [enemies, setEnemies] = useState([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [floats, setFloats] = useState([]);
  const [kills, setKills] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [progress, setProgress] = useState(getProgress(GAME_ID));

  const inputRef = useRef(null);
  const animRef = useRef(null);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const comboRef = useRef(combo);
  const enemiesRef = useRef(enemies);
  const elapsedRef = useRef(elapsed);

  comboRef.current = combo;
  enemiesRef.current = enemies;
  elapsedRef.current = elapsed;

  const cfg = DIFFICULTY[difficulty];

  const addFloat = useCallback((text, x, y) => {
    const id = Date.now() + Math.random();
    setFloats(p => [...p, { id, text, x, y }]);
    setTimeout(() => setFloats(p => p.filter(f => f.id !== id)), 900);
  }, []);

  const spawnEnemy = useCallback(() => {
    const t = pickType(elapsedRef.current);
    const lane = Math.floor(Math.random() * 8);
    eid++;
    const speed = cfg.baseSp * t.speedMult * (1 + elapsedRef.current * 0.002);
    setEnemies(p => [...p, { id: eid, word: getRandomWord(t.pool), typed: '', left: 102, top: 8 + lane * 10.5, ...t, speed }]);
  }, [cfg.baseSp]);

  const startLoop = useCallback(() => {
    const loop = () => {
      setEnemies(prev => {
        let hit = 0;
        const next = prev.map(e => {
          const nl = e.left - e.speed;
          if (nl <= 7) { hit++; return null; }
          return { ...e, left: nl };
        }).filter(Boolean);
        if (hit > 0) {
          setLives(l => { const nl = Math.max(0, l - hit); if (nl <= 0) setScreen('gameover'); return nl; });
          setCombo(0);
          setShake(true);
          setTimeout(() => setShake(false), 400);
        }
        return next;
      });
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
  }, []);

  const handleInput = useCallback((e) => {
    if (screen !== 'playing') return;
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');

    const current = enemiesRef.current;
    const sorted = [...current].sort((a, b) => a.left - b.left);
    const target = sorted.find(en => en.word.startsWith(val) && val.length > 0);

    if (target && val === target.word) {
      const pts = Math.round(target.pts * (1 + comboRef.current * 0.15));
      setScore(s => s + pts);
      setCombo(c => { const nc = c + 1; setMaxCombo(m => Math.max(m, nc)); return nc; });
      setKills(k => k + 1);
      addFloat(`+${pts}`, target.left, target.top);
      setEnemies(p => p.filter(en => en.id !== target.id));
      setInput('');
      e.target.value = '';
      return;
    }

    setInput(val);
    setEnemies(p => p.map(en => en.id === (target?.id) ? { ...en, typed: val } : { ...en, typed: '' }));
  }, [screen, addFloat]);

  const startGame = useCallback(() => {
    setEnemies([]); setLives(MAX_LIVES); setScore(0); setCombo(0); setMaxCombo(0);
    setInput(''); setKills(0); setElapsed(0); setCountdown(3); setScreen('countdown');
    let c = 3;
    const cd = setInterval(() => { c--; setCountdown(c); if (c <= 0) { clearInterval(cd); setScreen('playing'); } }, 1000);
  }, []);

  const stopGame = useCallback(() => setScreen('gameover'), []);

  useEffect(() => {
    if (screen === 'playing') {
      startLoop();
      spawnRef.current = setInterval(spawnEnemy, cfg.spawnMs);
      spawnEnemy();
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
      inputRef.current?.focus();
    }
    return () => { cancelAnimationFrame(animRef.current); clearInterval(spawnRef.current); clearInterval(timerRef.current); };
  }, [screen, startLoop, spawnEnemy, cfg.spawnMs]);

  useEffect(() => {
    if (screen !== 'playing') return;
    clearInterval(spawnRef.current);
    const ms = Math.max(500, cfg.spawnMs - elapsed * 15);
    spawnRef.current = setInterval(spawnEnemy, ms);
    return () => clearInterval(spawnRef.current);
  }, [elapsed, screen, spawnEnemy, cfg.spawnMs]);

  useEffect(() => {
    if (screen === 'gameover') {
      saveProgress(GAME_ID, { score, maxCombo, level: Math.floor(elapsed / 20) + 1 });
      setProgress(getProgress(GAME_ID));
    }
  }, [screen, score, maxCombo, elapsed]);

  const wave = Math.floor(elapsed / 20) + 1;

  // ── LANDING ──
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="text-center space-y-2">
            <div className="text-6xl">🛡️</div>
            <h1 className="text-4xl font-black">Cyber Defender</h1>
            <p className="text-muted-foreground">Defend your base by typing enemy words before they reach you</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Info className="w-4 h-4 text-cyan-500" /> About</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enemies approach your base from the right. Each carries a word — type it to destroy them.
              Different enemy types have different speeds and word difficulty. Survive as long as you can!
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
              <span>🛸 Scout — Fast, short words</span>
              <span>👾 Normal — Medium difficulty</span>
              <span>🤖 Tank — Slow, hard words</span>
              <span>💀 Boss — Rare, high reward</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold"><Lightbulb className="w-4 h-4 text-yellow-500" /> Tips & Tricks</div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Take out the closest enemies first — they're about to hit your base</li>
              <li>• Scouts are fast but easy — clear them quickly for combo</li>
              <li>• Input auto-clears after each kill, just start typing the next word</li>
              <li>• Bosses give 500+ points — worth the effort</li>
            </ul>
          </div>
          {progress.gamesPlayed > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold"><BarChart3 className="w-4 h-4 text-primary" /> Your Progress</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><p className="text-xl font-bold font-mono text-cyan-500">{progress.highScore.toLocaleString()}</p><p className="text-xs text-muted-foreground">High Score</p></div>
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
                  className={`p-3 rounded-xl border text-center transition-all ${difficulty === key ? 'border-cyan-500 bg-cyan-500/15 text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}`}
                >
                  <p className="font-bold text-sm">{d.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button onClick={startGame}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Play className="w-5 h-5" /> Deploy
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
          <span className="text-sm font-bold text-cyan-500 uppercase tracking-wider">Cyber Defender</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-bold">Wave {wave}</span>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <Shield key={i} className={`w-4 h-4 transition-all ${i < lives ? 'text-cyan-500 fill-cyan-500' : 'text-muted-foreground/30'}`} />
            ))}
          </div>
          <div className={`flex items-center gap-1 font-bold text-xs ${combo >= 5 ? 'text-orange-500' : 'text-cyan-500'}`}>
            <Zap className="w-3.5 h-3.5" />
            <span className="font-mono">x{(1 + combo * 0.15).toFixed(2)}</span>
          </div>
          <div className="font-mono font-bold text-sm tabular-nums">{score.toLocaleString()}</div>
          {screen === 'playing' && (
            <button onClick={stopGame} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Square className="w-3 h-3" /> Stop
            </button>
          )}
        </div>
      </div>

      <div className={`relative flex-1 overflow-hidden ${shake ? 'animate-[shake_0.3s_ease]' : ''}`}>
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        {/* Base */}
        <div className="absolute left-[4%] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
          <div className="text-3xl">🏯</div>
          <div className="flex gap-0.5">
            {Array.from({ length: lives }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-500" />)}
          </div>
        </div>

        {/* Enemies */}
        {enemies.map(en => (
          <div key={en.id} className="absolute flex flex-col items-center gap-0.5 pointer-events-none z-10"
            style={{ left: `${en.left}%`, top: `${en.top}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="text-xl">{en.emoji}</div>
            <div className={`px-2 py-0.5 rounded-lg font-mono text-xs font-bold border ${en.typed ? 'border-primary/50 bg-primary/10' : 'border-border bg-card'}`}>
              <span className="text-primary">{en.typed}</span>
              <span className="text-muted-foreground">{en.word.slice(en.typed.length)}</span>
            </div>
          </div>
        ))}

        {/* Floats */}
        {floats.map(f => (
          <div key={f.id} className="absolute pointer-events-none z-20 font-bold text-sm text-primary animate-[floatUp_0.9s_ease_forwards]"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >{f.text}</div>
        ))}

        {/* Input */}
        {screen === 'playing' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20">
            <input ref={inputRef} value={input} onChange={handleInput}
              className="w-56 px-4 py-2 rounded-xl bg-card border border-border text-foreground font-mono text-base text-center focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 placeholder:text-muted-foreground/40 transition-all"
              placeholder="target enemy..." autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
            />
          </div>
        )}

        {/* Countdown */}
        {screen === 'countdown' && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div key={countdown} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.5, opacity: 0 }}
                className="text-[8rem] font-black text-cyan-500"
              >{countdown || 'GO!'}</motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Game Over */}
        {screen === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-30 bg-background/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-1">
              <h2 className="text-3xl font-black">Base Destroyed</h2>
              <p className="text-muted-foreground">Wave {wave} · {kills} enemies eliminated</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-3 gap-4">
              {[
                { label: 'Score', value: score.toLocaleString(), accent: 'text-cyan-500' },
                { label: 'Max Combo', value: `x${maxCombo}`, accent: 'text-orange-500' },
                { label: 'Kills', value: kills, accent: 'text-green-500' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold font-mono ${s.accent}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex gap-3">
              <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all hover:scale-105">
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
