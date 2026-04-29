import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { FirebaseAuthProvider } from '@/lib/FirebaseAuthContext';
import AppLayout from '@/components/layout/AppLayout';
import Home from './pages/Home';
import TypingTest from './pages/TypingTest';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import FallingWords from './pages/games/FallingWords';
import CyberDefender from './pages/games/CyberDefender';
import FlashMemory from './pages/games/FlashMemory';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <FirebaseAuthProvider>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* Standalone full-screen game routes (no Navbar/Footer) */}
            <Route path="/games/falling" element={<FallingWords />} />
            <Route path="/games/defender" element={<CyberDefender />} />
            <Route path="/games/memory" element={<FlashMemory />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<TypingTest />} />

              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
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