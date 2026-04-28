import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Keyboard className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">TypeRush<span className="text-primary">.</span></span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The fastest way to measure and improve your typing speed. Free, minimal, and built for everyone.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Github, href: '#', label: 'GitHub' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Pages */}
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pages</p>
            {[
              { label: 'Home', path: '/' },
              { label: 'Typing Test', path: '/test' },
              { label: 'About', path: '/about' },
              { label: 'FAQ', path: '/faq' },
              { label: 'Contact', path: '/contact' },
            ].map(link => (
              <Link
                key={link.path}
                to={link.path}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Legal</p>
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2026 TypeRush. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with ❤️ for fast typists</p>
        </div>
      </div>
    </footer>
  );
}