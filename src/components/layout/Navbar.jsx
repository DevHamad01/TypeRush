import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Keyboard, Sun, Moon, Menu, X, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { useFirebaseAuth } from '@/lib/FirebaseAuthContext';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Test', path: '/test' },
  { label: 'Games', path: '/games', children: [
    { label: '🌧️  Falling Words', path: '/games/falling' },
    { label: '🛡️  Cyber Defender', path: '/games/defender' },
    { label: '🧠  Flash Memory', path: '/games/memory' },
  ]},
  { label: 'About', path: '/about' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar({ isDark, onToggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGamesOpen, setMobileGamesOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useFirebaseAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileGamesOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Keyboard className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              TypeRush<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              if (link.children) {
                return (
                  <div key={link.path} className="relative group">
                    <button
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                        ${isActive('/games')
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      {link.label}
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="w-52 py-2 bg-card border border-border rounded-xl shadow-xl">
                        {link.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors
                              ${location.pathname === child.path
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">{user?.full_name?.split(' ')[0] || 'Profile'}</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/signin"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/test"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Start Test
                </Link>
              </div>
            )}

            <button
              className="md:hidden w-9 h-9 rounded-lg border border-border flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-border pt-3">
            {NAV_LINKS.map(link => {
              if (link.children) {
                return (
                  <div key={link.path}>
                    <button
                      onClick={() => setMobileGamesOpen(!mobileGamesOpen)}
                      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${isActive(link.path)
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      {link.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mobileGamesOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileGamesOpen && (
                      <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                        {link.children.map(child => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all
                              ${location.pathname === child.path
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                              }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                    ${location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="block w-full text-center px-4 py-2.5 rounded-lg border border-border text-sm font-semibold">
                    My Profile
                  </Link>
                  <button onClick={() => logout()} className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-destructive border border-destructive/30">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="block w-full text-center px-4 py-2.5 rounded-lg border border-border text-sm font-semibold">
                    Login
                  </Link>
                  <Link to="/test" className="block w-full text-center px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                    Start Test
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}