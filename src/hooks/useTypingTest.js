import { useState, useEffect, useRef, useCallback } from 'react';

const WORD_BANKS = {
  easy: [
    "the quick brown fox jumps over the lazy dog and runs through the forest path while birds sing in the trees above",
    "she sells seashells by the seashore where the waves crash softly on the sand and children play with their colorful toys",
    "a simple life is often the best life with good food warm shelter kind friends and a peaceful mind that rests well",
    "the sun rises every morning painting the sky with shades of orange pink and gold before the busy world wakes up",
    "reading books every day can open your mind to new ideas places people and ways of thinking that change how you see life"
  ],
  medium: [
    "programming requires patience, precision, and the ability to debug complex systems under pressure while maintaining clean, readable code.",
    "the development of artificial intelligence has transformed industries ranging from healthcare to finance, raising profound ethical questions.",
    "effective communication involves not just speaking clearly, but also listening actively and understanding non-verbal cues in conversations.",
    "quantum computing leverages the principles of superposition and entanglement to solve computational problems exponentially faster than classical machines.",
    "the architecture of modern web applications demands careful consideration of scalability, security, performance, and maintainability from the outset."
  ],
  hard: [
    "Asynchronous JavaScript (async/await) built on Promises enables non-blocking I/O operations; however, unhandled rejections can silently break execution flow!",
    "The Byzantine fault-tolerant consensus algorithm ensures distributed systems achieve agreement even when 1/3 of nodes exhibit arbitrary, potentially malicious behavior.",
    "Cryptographic hash functions — SHA-256, bcrypt, Argon2 — transform variable-length inputs into fixed-size digests; collision resistance is paramount for security.",
    "In Kubernetes, pods are ephemeral: controllers (Deployments, StatefulSets, DaemonSets) reconcile desired vs. actual state, restarting failed containers automatically.",
    "O(n log n) merge sort outperforms O(n²) bubble sort; however, cache locality, branch prediction, and memory allocation affect real-world performance significantly!"
  ]
};

/**
 * @param {string} difficulty 
 */
function getRandomText(difficulty) {
  const bank = WORD_BANKS[/** @type {keyof typeof WORD_BANKS} */ (difficulty)] || WORD_BANKS.medium;
  return bank[Math.floor(Math.random() * bank.length)];
}

/**
 * @param {{duration?: number, difficulty?: string}} props
 */
export function useTypingTest({ duration = 60, difficulty = 'medium' }) {
  const [targetText, setTargetText] = useState('');
  const [typedChars, setTypedChars] = useState(/** @type {Array<{char: string, status: string}>} */ ([]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(/** @type {number | null} */ (null));
  const [shakeError, setShakeError] = useState(false);

  /** @type {React.MutableRefObject<any>} */
  const intervalRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLInputElement | null>} */
  const inputRef = useRef(null);

  /** @param {string | null} [customText] */
  const initTest = useCallback((customText = null) => {
    const text = customText || getRandomText(difficulty);
    setTargetText(text);
    setTypedChars(text.split('').map(char => ({ char, status: 'pending' })));
    setCurrentIndex(0);
    setTimeLeft(duration);
    setIsStarted(false);
    setIsFinished(false);
    setMistakes(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    setShakeError(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [difficulty, duration]);

  useEffect(() => {
    initTest();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initTest]);

  const handleInput = useCallback((/** @type {any} */ e) => {
    if (isFinished) return;

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
      // @ts-ignore
      // @ts-ignore
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    const val = e.target.value;
    if (!val) {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setTypedChars(prev => {
                const newChars = [...prev];
                newChars[currentIndex - 1].status = 'pending';
                return newChars;
            });
        }
        return;
    }
    
    // Check if delete backward occurred using string length differences
    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setTypedChars(prev => {
          const newChars = [...prev];
          newChars[currentIndex - 1].status = 'pending';
          return newChars;
        });
      }
      return;
    }

    const char = val[val.length - 1];

    if (char === targetText[currentIndex]) {
      setTypedChars(prev => {
        const newChars = [...prev];
        newChars[currentIndex].status = 'correct';
        return newChars;
      });
      setCurrentIndex(prev => prev + 1);

      if (currentIndex === targetText.length - 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsFinished(true);
      }
    } else {
      setTypedChars(prev => {
        const newChars = [...prev];
        newChars[currentIndex].status = 'incorrect';
        return newChars;
      });
      setMistakes(prev => prev + 1);
      setCurrentIndex(prev => prev + 1);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 200);

      if (currentIndex === targetText.length - 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsFinished(true);
      }
    }
  }, [currentIndex, isFinished, isStarted, targetText, targetText.length]);

  useEffect(() => {
    if (isStarted && startTime) {
      const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
      const wordsTyped = currentIndex / 5;
      const currentWpm = Math.round(wordsTyped / (timeElapsed || 0.01)) || 0;
      setWpm(currentWpm);
      
      const acc = currentIndex > 0 ? Math.round(((currentIndex - mistakes) / currentIndex) * 100) : 100;
      setAccuracy(Math.max(0, acc));
    }
  }, [currentIndex, isStarted, mistakes, startTime]);

  return {
    targetText,
    typedChars,
    currentIndex,
    timeLeft,
    isStarted,
    isFinished,
    mistakes,
    wpm,
    accuracy,
    shakeError,
    inputRef,
    handleInput,
    initTest
  };
}
