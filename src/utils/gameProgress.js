const STORAGE_KEY = 'typerusher_progress';

export function getProgress(gameId) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return data[gameId] || { highScore: 0, gamesPlayed: 0, bestCombo: 0, bestLevel: 0 };
  } catch { return { highScore: 0, gamesPlayed: 0, bestCombo: 0, bestLevel: 0 }; }
}

export function saveProgress(gameId, stats) {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const prev = data[gameId] || { highScore: 0, gamesPlayed: 0, bestCombo: 0, bestLevel: 0 };
    data[gameId] = {
      highScore: Math.max(prev.highScore, stats.score || 0),
      gamesPlayed: prev.gamesPlayed + 1,
      bestCombo: Math.max(prev.bestCombo, stats.maxCombo || 0),
      bestLevel: Math.max(prev.bestLevel, stats.level || stats.round || 0),
      lastPlayed: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}
