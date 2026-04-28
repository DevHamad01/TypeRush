import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'How is WPM (Words Per Minute) calculated?',
    a: 'WPM is calculated using the formula: (characters typed ÷ 5) ÷ minutes elapsed. We divide by 5 because the standard definition of a "word" in typing tests is 5 characters. So if you typed 350 characters in 60 seconds, your WPM = (350 ÷ 5) ÷ 1 = 70 WPM.'
  },
  {
    q: 'How is accuracy measured?',
    a: 'Accuracy = (correct characters ÷ total characters typed) × 100. For example, if you typed 200 characters and 8 were wrong, your accuracy = (192 ÷ 200) × 100 = 96%. Each character is checked individually the moment you press the key.'
  },
  {
    q: 'Does backspace affect my score?',
    a: 'Yes — when you make a mistake, it is logged immediately even if you use Backspace to correct it. Backspace lets you retype the character, but the initial error is still counted in your mistake total. This reflects real-world typing accuracy.'
  },
  {
    q: 'Is TypeRush free to use?',
    a: 'Yes! TypeRush is completely free and will remain free. There are no hidden fees, premium plans, or paywalls. Just open the site and start typing.'
  },
  {
    q: 'What difficulty level should I start with?',
    a: 'Start with Easy if you\'re new to typing tests — it uses simple, common words. Move to Medium for sentences with punctuation. Hard uses technical content with symbols, numbers, and complex vocabulary. Most users find Medium to be the best everyday challenge.'
  },
  {
    q: 'Why does my WPM change during the test?',
    a: 'Live WPM is calculated based on elapsed time and correct characters typed so far. Early in the test, small variations feel bigger. As more time passes and more characters are typed, the WPM reading stabilizes and becomes more accurate.'
  },
  {
    q: 'Can I use my own custom text?',
    a: 'This feature is on our roadmap! Currently, TypeRush provides pre-built text for each difficulty level. We rotate multiple passages per difficulty to keep things fresh.'
  },
  {
    q: 'Is there a time limit I must follow?',
    a: 'No — you choose your duration: 15s, 30s, 60s, or 120s. You can also finish early if you complete the entire text before the timer runs out. The test ends automatically in either case.'
  },
  {
    q: 'Do I need to create an account?',
    a: 'No account is required to take a typing test. Just open the app and start typing. An account system may be added in the future for tracking your progress over time.'
  },
];

/**
 * @param {{ item: any, isOpen: boolean, onToggle: any }} props
 */
function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card hover:border-primary/30 transition-colors">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
      >
        <span className="font-semibold text-base">{item.q}</span>
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center bg-muted transition-all duration-300 ${isOpen ? 'bg-primary/10 rotate-180' : ''}`}>
          <ChevronDown className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 pt-0 text-muted-foreground leading-relaxed border-t border-border">
              <p className="pt-4">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  /** @param {any} i */
  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <HelpCircle className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-5xl font-bold">FAQ</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about TypeRush
        </p>
      </motion.div>

      {/* FAQ List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {FAQS.map((item, i) => (
          <FAQItem
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </motion.div>

      {/* Still have questions */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-primary/5 border border-primary/15 rounded-2xl p-8 text-center space-y-4"
      >
        <h3 className="text-xl font-bold">Still have questions?</h3>
        <p className="text-muted-foreground">Can't find what you're looking for? We're happy to help.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 hover:scale-105 transition-all"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
}