import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Target, BarChart3, PlayCircle, ChevronRight, Star, ArrowRight, Users, Award } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Real-Time WPM', desc: 'Your speed updates live as you type. Watch your WPM climb with every word.', color: 'text-primary bg-primary/10' },
  { icon: Target, title: 'Accuracy Tracking', desc: 'Every character is checked instantly. Green means correct, red means fix it.', color: 'text-green-500 bg-green-500/10' },
  { icon: BarChart3, title: '3 Difficulty Levels', desc: 'Start easy with simple words, work up to technical text with symbols.', color: 'text-orange-500 bg-orange-500/10' },
];

const STEPS = [
  { step: '01', title: 'Choose Settings', desc: 'Pick your test duration (15s, 30s, 60s, 120s) and difficulty level.' },
  { step: '02', title: 'Start Typing', desc: 'Press any key to begin. Watch characters highlight green or red in real-time.' },
  { step: '03', title: 'See Your Results', desc: 'Get your WPM, accuracy percentage, and error count when time runs out.' },
];

const TESTIMONIALS = [
  { quote: 'Went from 45 to 90 WPM in 3 weeks using TypeRush every day.', author: 'Sarah K.', role: 'Student' },
  { quote: 'Best minimal typing test I\'ve used. Clean, fast, no distractions.', author: 'Marcus T.', role: 'Developer' },
  { quote: 'The real-time feedback helped me fix my bad habits instantly.', author: 'Ahmed R.', role: 'Data Analyst' },
];

const STATS = [
  { value: '10,000+', label: 'Tests Taken', icon: BarChart3, sub: 'and counting', gradient: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/20', iconBg: 'bg-violet-500/15', iconColor: 'text-violet-500', valueColor: 'text-violet-500' },
  { value: '68 WPM', label: 'Average Speed', icon: Zap, sub: 'across all users', gradient: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-500/20', iconBg: 'bg-orange-500/15', iconColor: 'text-orange-500', valueColor: 'text-orange-500' },
  { value: '3 Modes', label: 'Difficulty Levels', icon: Target, sub: 'easy · medium · hard', gradient: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-500', valueColor: 'text-emerald-500' },
  { value: '100%', label: 'Always Free', icon: Award, sub: 'no hidden costs', gradient: 'from-primary/10 to-primary/5', border: 'border-primary/20', iconBg: 'bg-primary/15', iconColor: 'text-primary', valueColor: 'text-primary' },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                Free Typing Speed Test
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              How fast do
              <br />
              you <span className="text-primary">type?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
            >
              Measure your WPM, accuracy, and improve with real-time per-character feedback.
              No signup required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/test"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-lg font-bold hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/25"
              >
                <PlayCircle className="w-5 h-5" />
                Start Typing Test
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-border text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                Learn More
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              No login required · Free forever · Instant results
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-14 overflow-hidden">
        {/* Gradient line top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/3 via-transparent to-primary/3 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeOut' }}
                className={`relative group bg-gradient-to-br ${s.gradient} border ${s.border} rounded-2xl p-5 overflow-hidden
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}
              >
                {/* Corner glow */}
                <div className={`absolute -top-4 -right-4 w-16 h-16 ${s.iconBg} rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity`} />

                <div className="relative space-y-3">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                    <s.icon className={`w-4.5 h-4.5 ${s.iconColor}`} />
                  </div>
                  {/* Value */}
                  <div>
                    <p className={`text-2xl font-bold font-mono ${s.valueColor} tabular-nums leading-none`}>{s.value}</p>
                    <p className="text-xs font-bold text-foreground mt-1.5 uppercase tracking-wider">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Features</p>
            <h2 className="text-4xl font-bold">Everything you need</h2>
            <p className="text-lg text-muted-foreground">Built for speed, accuracy, and a clean experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-bold">Start typing in seconds</h2>
            <p className="text-muted-foreground text-lg">No registration required. Just start typing.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/20 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-3">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Testimonials</p>
            <h2 className="text-4xl font-bold">What users say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <p className="text-muted-foreground mb-4">"{t.quote}"</p>
                <div>
                  <p className="font-bold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to improve your typing?</h2>
          <p className="text-xl text-muted-foreground">Start your free typing test now and track your progress.</p>
          <Link
            to="/test"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-primary text-primary-foreground text-lg font-bold hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/25"
          >
            <PlayCircle className="w-5 h-5" />
            Start Typing Test
          </Link>
        </div>
      </section>
    </div>
  );
}