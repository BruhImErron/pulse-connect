import { motion } from "framer-motion";

interface HeartLogoProps {
  size?: number;
  showText?: boolean;
  collapsed?: boolean;
}

const HeartLogo = ({ size = 32, showText = true, collapsed = false }: HeartLogoProps) => {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative flex items-center justify-center rounded-xl bg-primary"
        style={{ width: size, height: size }}
        animate={{
          scale: [1, 1.12, 1, 1.08, 1],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-primary-foreground"
          style={{ width: size * 0.55, height: size * 0.55 }}
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-primary"
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-xl border border-primary"
          animate={{ scale: [1, 2], opacity: [0.2, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
        />
      </motion.div>
      {showText && !collapsed && (
        <motion.span
          className="font-heading text-lg font-bold text-foreground"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          PulsePoint
        </motion.span>
      )}
    </div>
  );
};

export default HeartLogo;
