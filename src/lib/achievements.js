// Achievement definitions
export const ACHIEVEMENTS = [
  // Speed milestones
  {
    id: 'wpm_40',
    title: '40 WPM Club',
    description: 'Reach 40 words per minute',
    icon: '🚀',
    category: 'speed',
    check: (/** @type {any} */ stats) => stats.bestWpm >= 40,
  },
  {
    id: 'wpm_60',
    title: '60 WPM Club',
    description: 'Reach 60 words per minute',
    icon: '⚡',
    category: 'speed',
    check: (/** @type {any} */ stats) => stats.bestWpm >= 60,
  },
  {
    id: 'wpm_80',
    title: '80 WPM Club',
    description: 'Reach 80 words per minute',
    icon: '🔥',
    category: 'speed',
    check: (/** @type {any} */ stats) => stats.bestWpm >= 80,
  },
  {
    id: 'wpm_100',
    title: '100 WPM Club',
    description: 'Reach 100 words per minute — elite typist!',
    icon: '💎',
    category: 'speed',
    check: (/** @type {any} */ stats) => stats.bestWpm >= 100,
  },
  {
    id: 'wpm_120',
    title: 'Speed Demon',
    description: 'Reach 120 words per minute',
    icon: '👑',
    category: 'speed',
    check: (/** @type {any} */ stats) => stats.bestWpm >= 120,
  },

  // Accuracy milestones
  {
    id: 'accuracy_95',
    title: 'Sharp Shooter',
    description: 'Finish a test with 95%+ accuracy',
    icon: '🎯',
    category: 'accuracy',
    check: (/** @type {any} */ stats) => stats.bestAccuracy >= 95,
  },
  {
    id: 'accuracy_100',
    title: 'Perfect Accuracy',
    description: 'Finish a test with 100% accuracy',
    icon: '✨',
    category: 'accuracy',
    check: (/** @type {any} */ stats) => stats.bestAccuracy >= 100,
  }
];

export const CATEGORY_LABELS = {
  all: 'All',
  speed: 'Speed',
  accuracy: 'Accuracy',
  volume: 'Volume',
  special: 'Special'
};

export const CATEGORY_COLORS = {
  speed: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  accuracy: 'text-green-500 bg-green-500/10 border-green-500/20',
  volume: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  special: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
};
