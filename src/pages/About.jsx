import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Zap, Heart, Users, BookOpen, TrendingUp, PlayCircle } from 'lucide-react';

const BENEFITS = [
  { icon: TrendingUp, title: 'Boost Productivity', desc: 'Typing faster means getting more done. Even 10 extra WPM saves hours each week.' },
  { icon: Target, title: 'Improve Accuracy', desc: 'Fewer mistakes means less time correcting. Accuracy compounds over thousands of words.' },
  { icon: Zap, title: 'Build Confidence', desc: 'Knowing you type well reduces mental friction and helps you focus on ideas, not keys.' },
];

const VALUES = [
  { emoji: '⚡', title: 'Fast', desc: 'Instant feedback on every keystroke.' },
  { emoji: '🎯', title: 'Accurate', desc: 'Precise WPM and accuracy calculations.' },
  { emoji: '🆓', title: 'Free', desc: 'Always free, no hidden costs.' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
          <BookOpen className="w-3.5 h-3.5" />
          About TypeRush
        </span>
        <h1 className="text-5xl font-bold tracking-tight">Built for people who type</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          TypeRush was built because great typing test tools shouldn't be buried under ads, signups, and complexity.
        </p>
      </motion.div>

      {/* Mission */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card border border-border rounded-2xl p-10 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Our Mission</h2>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">
          We built TypeRush to help anyone improve their typing — from students learning to type faster,
          to developers who want to write code with less friction, to professionals who spend their day
          in a text editor. TypeRush gives you instant, honest feedback in the cleanest interface possible.
        </p>
      </motion.div>

      {/* Benefits */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Why typing speed matters</h2>
          <p className="text-muted-foreground">Small improvements create massive long-term gains</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg">{b.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Our values</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-muted/40 border border-border rounded-2xl p-6 text-center space-y-2"
            >
              <span className="text-3xl">{v.emoji}</span>
              <p className="font-bold">{v.title}</p>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-primary/5 border border-primary/15 rounded-2xl p-10 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">The Story</h2>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">
          TypeRush started as a personal project — a clean, no-nonsense alternative to the cluttered typing
          test sites that exist today. The goal was simple: build the typing test we actually wanted to use.
          Fast to load, beautiful to look at, and honest with your results. What started as a weekend project
          is now used by thousands of people who care about typing better.
        </p>
      </motion.div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Ready to start?</h2>
        <Link
          to="/test"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          <PlayCircle className="w-5 h-5" />
          Take a Typing Test
        </Link>
      </div>
    </div>
  );
}
 