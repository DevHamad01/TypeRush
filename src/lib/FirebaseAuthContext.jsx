import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  firebaseSignOut 
} from '@/lib/firebase';

const FirebaseAuthContext = createContext(/** @type {any} */ (null));

/**
 * @param {{ children: React.ReactNode }} props
 */
export const FirebaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(/** @type {any} */ (null));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    try {
      unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        console.log('Auth state changed:', currentUser);
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        setIsLoadingAuth(false);
        setAuthError(null);
      });
    } catch (error) {
      console.error('Firebase auth initialization error:', error);
      setAuthError(error.message);
      setIsLoadingAuth(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // If there's a Firebase auth error, still render children but log it
  if (authError) {
    console.error('Firebase Auth Error:', authError);
  }

  // Show loading state
  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <FirebaseAuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      authError,
      logout
    }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within FirebaseAuthProvider');
  }
  return context;
};
