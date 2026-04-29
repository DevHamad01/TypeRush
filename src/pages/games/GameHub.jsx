import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ChevronRight, Gamepad2, Trophy, Star } from 'lucide-react';

const GAME_MODES = [
  {
    id: 'falling', path: '/games/falling', icon: '🌧️', title: 'Falling Words', subtitle: 'Survival',
    desc: 'Words rain from the sky. Type them before they hit the danger zone. Speed increases every level.',
    border: 'border-purple-500/30', badgeBg: 'bg-purple-500/20', badgeText: 'text-purple-300',
    btnClass: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20', accent: 'text-purple-400',
    tag: 'Arcade', stats: ['Speed Scaling', 'Combo System', 'Infinite Survival'],
  },
  {
    id: 'defender', path: '/games/defender', icon: '🛡️', title: 'Cyber Defender', subtitle: 'Wave Attack',
    desc: 'Enemies charge your base. Type their words to destroy them before they breach your defenses.',
    border: 'border-cyan-500/30', badgeBg: 'bg-cyan-500/20', badgeText: 'text-cyan-300',
    btnClass: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20', accent: 'text-cyan-400',
    tag: 'Strategy', stats: ['4 Enemy Types', 'Infinite Waves', 'Boss Enemies'],
  },
  {
    id: 'memory', path: '/games/memory', icon: '🧠', title: 'Flash Memory', subtitle: 'Mind Test',
    desc: 'Words flash on screen, then vanish. Type them back from memory. Tests speed AND your brain.',
    border: 'border-emerald-500/30', badgeBg: 'bg-emerald-500/20', badgeText: 'text-emerald-300',
    btnClass: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20', accent: 'text-emerald-400',
    tag: 'Memory', stats: ['3 Difficulty Modes', 'Multi-Word Rounds', 'No Peeking!'],
  },
];

export default function GameHub() {
  return (
    <div className="min-h-[80vh] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
            <Gamepad2 className="w-3.5 h-3.5" /> Arcade Game Hub
          </div>
          <h1 className="text-5xl md:text-6xl font-black">Choose Your Game</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Three unique modes. One keyboard. How long can you survive?</p>
        </motion.div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {GAME_MODES.map((mode, i) => (
            <motion.div key={mode.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative group flex flex-col bg-card border ${mode.border} rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
            >
              <span className={`absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-bold ${mode.badgeBg} ${mode.badgeText}`}>{mode.tag}</span>
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{mode.icon}</div>
              <h3 className="text-xl font-black mb-0.5">{mode.title}</h3>
              <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${mode.accent}`}>{mode.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">{mode.desc}</p>
              <ul className="space-y-1.5 mb-6">
                {mode.stats.map(stat => (
                  <li key={stat} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className={`w-3 h-3 ${mode.accent} flex-shrink-0`} /> {stat}
                  </li>
                ))}
              </ul>
              <Link to={mode.path}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-sm transition-all hover:scale-[1.03] active:scale-[0.97] shadow-lg ${mode.btnClass}`}
              >
                Play Now <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Pro tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold">Pro Tips</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: '⚡', text: 'Build combos for score multipliers — never make mistakes!' },
              { icon: '🎯', text: "In Falling Words, prioritize red words — they're about to hit!" },
              { icon: '🛸', text: 'In Cyber Defender, take out Scouts first — they move fastest.' },
              { icon: '🧠', text: 'In Flash Memory, say the word aloud as it appears to help memorize.' },
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="text-lg flex-shrink-0">{tip.icon}</span><span>{tip.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center mt-10">
          <p className="text-muted-foreground/60 text-sm mb-2">Looking for the classic experience?</p>
          <Link to="/test" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold transition-colors underline underline-offset-4">
            <Zap className="w-4 h-4" /> Standard Typing Test
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
