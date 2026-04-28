import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @param {{ achievements: Array<{id: string, title: string, description: string, icon: string}>, onDismiss: () => void }} props
 */
export default function AchievementToast({ achievements, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!achievements?.length) return;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 4000);
    return () => clearTimeout(timer);
  }, [achievements]);

  if (!achievements?.length) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {visible && achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ delay: i * 0.15, duration: 0.35, ease: 'easeOut' }}
            className="bg-card border border-primary/30 rounded-2xl px-5 py-4 shadow-2xl shadow-primary/10 flex items-center gap-4 min-w-[260px]"
          >
            <div className="text-3xl">{a.icon}</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">Achievement Unlocked!</p>
              <p className="font-bold text-sm">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.description}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}