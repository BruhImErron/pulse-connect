import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface DecipherTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const DecipherText = ({ text, className = '', delay = 0 }: DecipherTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isDeciphering, setIsDeciphering] = useState(true);

  useEffect(() => {
    const startTime = Date.now() + delay;

    const interval = setInterval(() => {
      if (Date.now() - startTime < 200) {
        // During decipher phase (200ms)
        const newText = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
        setDisplayText(newText);
      } else {
        // Lock into final text
        setDisplayText(text);
        setIsDeciphering(false);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <motion.span
      className={`font-mono ${className}`}
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      {displayText}
    </motion.span>
  );
};