import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target, BarChart3, RotateCcw, Lock, Keyboard, Star, TrendingUp, Hash, LogOut, User } from 'lucide-react';
import { ACHIEVEMENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/achievements';
import { useStats } from '@/hooks/useStats';
import { useFirebaseAuth } from '@/lib/FirebaseAuthContext';
import { Link } from 'react-router-dom';

const ALL_CATEGORIES = ['all', 'speed', 'accuracy', 'volume', 'special'];

// Premium stat card configs — each with its own personality
const STAT_CARDS = [
  {
    label: 'Tests Taken',
    key: 'totalTests',
    icon: BarChart3,
    suffix: '',
    gradient: 'from-violet-500/15 to-violet-500/5',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-500',
    valueColor: 'text-violet-500',
    glow: 'hover:shadow-violet-500/10',
    badge: 'Total Sessions',
  },
  {
    label: 'Best WPM',
    key: 'bestWpm',
    icon: Zap,
    suffix: '',
    gradient: 'from-orange-500/15 to-orange-500/5',
    border: 'border-orange-500/20',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-500',
    valueColor: 'text-orange-500',
    glow: 'hover:shadow-orange-500/10',
    badge: 'Personal Record',
    unit: 'WPM',
  },
  {
    label: 'Best Accuracy',
    key: 'bestAccuracy',
    icon: Target,
    suffix: '%',
    gradient: 'from-emerald-500/15 to-emerald-500/5',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-500',
    valueColor: 'text-emerald-500',
    glow: 'hover:shadow-emerald-500/10',
    badge: 'Top Score',
  },
  {
    label: 'Characters Typed',
    key: 'totalChars',
    icon: Hash,
    suffix: '',
    gradient: 'from-sky-500/15 to-sky-500/5',
    border: 'border-sky-500/20',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-500',
    valueColor: 'text-sky-500',
    glow: 'hover:shadow-sky-500/10',
    badge: 'Lifetime',
  },
];

/**
 * @param {{ card: any, value: any, index: number }} props
 */
function StatCard({ card, value, index }) {
  const displayValue = card.key === 'totalChars'
    ? value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toLocaleString()
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.4, ease: 'easeOut' }}
      className={`relative group bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl p-5 overflow-hidden
        hover:shadow-xl ${card.glow} hover:-translate-y-1 transition-all duration-300 cursor-default`}
    >
      {/* Subtle corner glow */}
      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${card.iconBg} blur-xl opacity-50 group-hover:opacity-80 transition-opacity`} />

      <div className="relative space-y-4">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.iconBg} ${card.iconColor} tracking-wide`}>
            {card.badge}
          </span>
        </div>

        {/* Value */}
        <div>
          <div className="flex items-end gap-1.5 leading-none">
            <span className={`text-4xl font-bold font-mono ${card.valueColor} tabular-nums`}>
              {displayValue}
            </span>
            {card.unit && (
              <span className={`text-sm font-bold ${card.iconColor} mb-1 opacity-70`}>{card.unit}</span>
            )}
            {card.suffix && (
              <span className={`text-xl font-bold ${card.iconColor} mb-0.5 opacity-80`}>{card.suffix}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-semibold mt-2 uppercase tracking-widest">{card.label}</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * @param {{ achievement: any, unlocked: boolean, delay: number }} props
 */
function AchievementCard({ achievement, unlocked, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`relative group flex items-start gap-4 rounded-2xl p-5 border transition-all duration-300
        ${unlocked
          // @ts-ignore
          ? 'bg-card border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5'
          : 'bg-muted/30 border-border/50 opacity-50 grayscale'
        }`}
    >
      {/* Icon */}
      <div className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all
        ${unlocked ? `${/** @type {any} */(CATEGORY_COLORS)[achievement.category]} group-hover:scale-110` : 'bg-muted border-border'}`}>
        {unlocked ? achievement.icon : <Lock className="w-4 h-4 text-muted-foreground" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-bold text-sm ${!unlocked && 'text-muted-foreground'}`}>{achievement.title}</p>
          {unlocked && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${/** @type {any} */(CATEGORY_COLORS)[achievement.category]}`}>
              {/** @type {any} */(CATEGORY_LABELS)[achievement.category]}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{achievement.description}</p>
      </div>

      {/* Unlocked dot */}
      {unlocked && (
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      )}
    </motion.div>
  );
}

export default function Profile() {
  const { stats, resetStats } = useStats();
  const { user, logout } = useFirebaseAuth();
  const [filter, setFilter] = useState('all');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unlockedIds = new Set(stats.unlockedAchievements || []);
  const unlockedCount = unlockedIds.size;
  const totalCount = ACHIEVEMENTS.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  const filtered = filter === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.category === filter);

  const handleReset = () => {
    resetStats();
    setShowResetConfirm(false);
  };

  // Skill level based on best WPM
  /** @param {number} wpm */
  const getSkillLevel = (wpm) => {
    if (wpm >= 100) return { label: 'Speed Demon', color: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/20' };
    if (wpm >= 80) return { label: 'Expert', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' };
    if (wpm >= 60) return { label: 'Advanced', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    return { label: 'Beginner', color: 'text-stone-500', bg: 'bg-stone-500/10 border-stone-500/20' };
  };

  const skill = getSkillLevel(stats.bestWpm);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* User Info */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.displayName || user?.email || 'User'}</h2>
            <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card, index) => (
          <StatCard
            key={card.key}
            card={card}
            value={stats[card.key] || 0}
            index={index}
          />
        ))}
      </div>

      {/* Skill Level */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Skill Level</h2>
        <span className={`px-4 py-2 rounded-full border ${skill.bg} ${skill.color}`}>
          {skill.label}
        </span>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Achievements</h2>
          <span className="text-sm text-muted-foreground">{unlockedCount}/{totalCount} unlocked</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-primary rounded-full"
          />
        </div>

        {/* Achievement Grid */}
        <div className="grid gap-4">
          {filtered.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={unlockedIds.has(achievement.id)}
              delay={index * 0.05}
            />
          ))}
        </div>
      </div>

      {/* Reset Stats */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-semibold mb-4">Reset Stats</h2>
        <p className="text-sm text-muted-foreground mb-4">This will permanently delete all your typing statistics and achievements.</p>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-lg border border-destructive/30 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-all"
          >
            Reset All Stats
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}