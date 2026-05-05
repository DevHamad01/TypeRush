import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import PageNotFound from './lib/PageNotFound';
import { FirebaseAuthProvider } from '@/lib/FirebaseAuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Home from './pages/Home';
import TypingTest from './pages/TypingTest';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Lazy load pages to reduce initial bundle
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Lazy load games
const FallingWords = lazy(() => import('./pages/games/FallingWords'));
const CyberDefender = lazy(() => import('./pages/games/CyberDefender'));
const FlashMemory = lazy(() => import('./pages/games/FlashMemory'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <FirebaseAuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<Suspense fallback={<LoadingFallback />}><SignIn /></Suspense>} />
            <Route path="/signup" element={<Suspense fallback={<LoadingFallback />}><SignUp /></Suspense>} />
            <Route path="/forgot-password" element={<Suspense fallback={<LoadingFallback />}><ForgotPassword /></Suspense>} />
            {/* Standalone full-screen game routes (no Navbar/Footer) */}
            <Route path="/games/falling" element={<Suspense fallback={<LoadingFallback />}><FallingWords /></Suspense>} />
            <Route path="/games/defender" element={<Suspense fallback={<LoadingFallback />}><CyberDefender /></Suspense>} />
            <Route path="/games/memory" element={<Suspense fallback={<LoadingFallback />}><FlashMemory /></Suspense>} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<TypingTest />} />
              <Route path="/about" element={<Suspense fallback={<LoadingFallback />}><About /></Suspense>} />
              <Route path="/faq" element={<Suspense fallback={<LoadingFallback />}><FAQ /></Suspense>} />
              <Route path="/contact" element={<Suspense fallback={<LoadingFallback />}><Contact /></Suspense>} />
              <Route path="/profile" element={<Suspense fallback={<LoadingFallback />}><ProtectedRoute><Profile /></ProtectedRoute></Suspense>} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </FirebaseAuthProvider>
    </QueryClientProvider>
  )
}

export default App