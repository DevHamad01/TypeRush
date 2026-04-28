import React from 'react';
import { useFirebaseAuth } from '@/lib/FirebaseAuthContext';
import { motion } from 'framer-motion';
import { Lock, LogIn, Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';

function LoginWall() {
  const { logout } = useFirebaseAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md w-full space-y-6"
      >
        {/* Icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Keyboard className="w-9 h-9 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center shadow-md">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Sign in to continue</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your profile, stats, and achievements are waiting for you. Sign in to track your progress.
          </p>
        </div>

        {/* Perks */}
        <div className="bg-muted/40 border border-border rounded-2xl p-4 text-left space-y-2.5">
          {[
            { emoji: '📈', text: 'Track your WPM improvement over time' },
            { emoji: '🏆', text: 'Unlock achievements and badges' },
            { emoji: '💾', text: 'Auto-save every test result' },
          ].map(({ emoji, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-lg">{emoji}</span>
              <span className="text-sm text-muted-foreground font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            to="/signin"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
          >
            <LogIn className="w-5 h-5" />
            Sign In to TypeRush
          </Link>
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoadingAuth } = useFirebaseAuth();

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginWall />;
  }

  return children;
}