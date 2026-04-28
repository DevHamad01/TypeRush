import React, { useEffect, useRef } from 'react';

/**
 * @param {{ typedChars: Array<{char: string, status: string}>, currentIndex: number, shakeError: boolean }} props
 */
export default function TextDisplay({ typedChars, currentIndex, shakeError }) {
  /** @type {React.RefObject<HTMLDivElement>} */
  const containerRef = useRef(null);
  /** @type {React.RefObject<HTMLSpanElement>} */
  const cursorRef = useRef(null);

  useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const cursor = cursorRef.current;
      const container = containerRef.current;
      const cursorTop = cursor.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollTarget = cursorTop - containerHeight / 2;
      container.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden h-[140px] select-none ${shakeError ? 'animate-shake' : ''}`}
      style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}
    >
      <p className="font-mono text-xl leading-relaxed tracking-wide">
        {typedChars.map((item, i) => {
          let className = '';
          if (i < currentIndex) {
            className = item.status === 'correct' ? 'char-correct' : 'char-incorrect';
          } else if (i === currentIndex) {
            className = 'char-cursor char-pending';
          } else {
            className = 'char-pending';
          }
          return (
            <span
              key={i}
              ref={i === currentIndex ? cursorRef : null}
              className={`transition-colors duration-75 ${className}`}
            >
              {item.char}
            </span>
          );
        })}
      </p>
    </div>
  );
}