import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-secondary hover:bg-border transition-colors"
      data-cursor-hover
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Moon size={16} strokeWidth={1.5} className="text-foreground" />
      </motion.div>
      <motion.div
        animate={{ rotate: isDark ? -180 : 0, scale: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="absolute"
      >
        <Sun size={16} strokeWidth={1.5} className="text-foreground" />
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
