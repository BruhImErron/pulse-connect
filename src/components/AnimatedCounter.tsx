import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 1.2, className = "" }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / (duration * 1000);
      if (elapsed >= 1) {
        setCount(value);
        return;
      }
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCount(Math.floor(eased * value));
      requestAnimationFrame(tick);
    };
    tick();
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={`font-mono ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};

export default AnimatedCounter;
