import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/**
 * Bio-Reactive ECG Waveform Component
 * Purpose: Interactive medical-grade electrocardiogram with hover-sync and telemetry
 * Features: Cursor magnet effect, real-time stats tooltips, emergency beacon mode
 */

interface HeartbeatMonitorProps {
  className?: string;
  onEmergencyMode?: (active: boolean) => void;
}

const HeartbeatMonitor = ({ className = "", onEmergencyMode }: HeartbeatMonitorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [longPressActive, setLongPressActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [stats, setStats] = useState({ ngos: 50, volunteers: 2400, impact: 98 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor magnet effect
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 30 });

  // Long press detection
  const longPressTimer = useRef<NodeJS.Timeout>();
  const longPressDelay = 1000; // 1 second

  useEffect(() => {
    const updateStats = () => {
      // Simulate real-time stats updates
      setStats(prev => ({
        ngos: prev.ngos + Math.floor(Math.random() * 3 - 1),
        volunteers: prev.volunteers + Math.floor(Math.random() * 10 - 5),
        impact: Math.max(95, Math.min(100, prev.impact + Math.floor(Math.random() * 3 - 1)))
      }));
    };

    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });
    cursorX.set(x);
    cursorY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    setLongPressActive(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setLongPressActive(true);
      const newEmergencyMode = !emergencyMode;
      setEmergencyMode(newEmergencyMode);
      onEmergencyMode?.(newEmergencyMode);
    }, longPressDelay);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setLongPressActive(false);
  };
  /**
   * generateECGWave()
   * Generates ultra-accurate ECG pattern with cursor magnet effect
   * The waveform is attracted to the cursor position when hovering
   */
  const generateECGWave = (offset: number, amplitudeMultiplier: number = 1) => {
    let path = `M 0,50`;
    const segments = 800; // More segments for ultra-smooth tracing
    const baseline = 50;
    const amplitude = 20 * amplitudeMultiplier; // Increased base amplitude

    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 100;
      const cycles = 4; // Number of heartbeat cycles across the width
      const cyclePos = ((x / 100) * cycles + offset) % 1; // Position within one cycle (0-1)

      let y = baseline; // Default: baseline

      // ===== P WAVE (0% - 10%) - Atrial depolarization =====
      if (cyclePos >= 0 && cyclePos < 0.1) {
        const progress = cyclePos / 0.1;
        // Smoother sinusoidal curve
        y = baseline - 5 * amplitudeMultiplier * Math.sin(progress * Math.PI);
      }

      // ===== PR INTERVAL (10% - 18%) - Flat baseline =====
      else if (cyclePos >= 0.1 && cyclePos < 0.18) {
        y = baseline;
      }

      // ===== QRS COMPLEX (18% - 35%) - Main ventricular spike =====
      else if (cyclePos >= 0.18 && cyclePos < 0.35) {
        const qrsProgress = (cyclePos - 0.18) / 0.17;

        if (qrsProgress < 0.12) {
          // Q wave - subtle downstroke
          const qProgress = qrsProgress / 0.12;
          y = baseline + 2 * amplitudeMultiplier * Math.sin(qProgress * Math.PI);
        } else if (qrsProgress < 0.48) {
          // R wave - dominant peak (60% of QRS width)
          const rProgress = (qrsProgress - 0.12) / 0.36;
          y = baseline - 20 * amplitudeMultiplier * Math.sin(rProgress * Math.PI);
        } else {
          // S wave - downstroke after peak
          const sProgress = (qrsProgress - 0.48) / 0.52;
          y = baseline + 6 * amplitudeMultiplier * Math.sin(sProgress * Math.PI);
        }
      }

      // ===== ST SEGMENT (35% - 50%) - Flat baseline =====
      else if (cyclePos >= 0.35 && cyclePos < 0.5) {
        y = baseline;
      }

      // ===== T WAVE (50% - 70%) - Ventricular repolarization =====
      else if (cyclePos >= 0.5 && cyclePos < 0.7) {
        const tProgress = (cyclePos - 0.5) / 0.2;
        y = baseline - 8 * amplitudeMultiplier * Math.sin(tProgress * Math.PI);
      }

      // ===== TP INTERVAL (70% - 100%) - Baseline until next beat =====
      else if (cyclePos >= 0.7 && cyclePos <= 1) {
        y = baseline;
      }

      // ===== CURSOR MAGNET EFFECT =====
      // When hovering, the waveform is attracted to the cursor
      if (isHovered && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cursorXNormalized = (springX.get() / rect.width) * 100;
        const cursorYNormalized = (springY.get() / rect.height) * 100;

        // Calculate distance from current point to cursor
        const distance = Math.sqrt(
          Math.pow(x - cursorXNormalized, 2) +
          Math.pow((y - 50) * 2 - cursorYNormalized + 50, 2)
        );

        // Magnet strength decreases with distance
        const magnetStrength = Math.max(0, 1 - distance / 30);
        const magnetDirection = cursorYNormalized < 50 ? -1 : 1;

        y += magnetDirection * magnetStrength * 8 * amplitudeMultiplier;
      }

      path += ` L ${x},${y}`;
    }

    // Close the path for the filled area
    path += ` L 100,80 L 0,80 Z`;
    return path;
  };

  const amplitudeMultiplier = isHovered ? 1.6 : 1;

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden pointer-events-auto ${className} ${
        emergencyMode ? 'emergency-beacon' : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        height: "100px",
        position: 'relative',
        cursor: longPressActive ? 'grabbing' : isHovered ? 'grab' : 'default'
      }}
    >
      {/* Emergency Beacon Overlay */}
      {emergencyMode && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-lg"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            boxShadow: [
              '0 0 20px rgba(245, 158, 11, 0.3)',
              '0 0 40px rgba(245, 158, 11, 0.6)',
              '0 0 20px rgba(245, 158, 11, 0.3)'
            ]
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}

      {/* Micro-Telemetry Tooltip */}
      {showTooltip && (
        <motion.div
          className="absolute top-2 left-2 bg-black/90 text-green-400 px-3 py-2 rounded font-mono text-xs border border-red-500/30 backdrop-blur-sm z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            left: mousePos.x + 10,
            top: mousePos.y - 40
          }}
        >
          <div>NGOs: {stats.ngos}</div>
          <div>Volunteers: {stats.volunteers}</div>
          <div>Impact: {stats.impact}%</div>
          {longPressActive && <div className="text-amber-400 mt-1">EMERGENCY MODE</div>}
        </motion.div>
      )}

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{
          filter: emergencyMode
            ? "drop-shadow(0 0 30px rgba(245,158,11,0.8)) sepia(20%) saturate(1.5)"
            : isHovered
            ? "drop-shadow(0 0 20px rgba(239,68,68,0.8)) drop-shadow(0 0 40px rgba(239,68,68,0.5))"
            : "drop-shadow(0 8px 25px rgba(239,68,68,0.3))",
          transition: "filter 0.3s ease",
        }}
      >
        <defs>
          {/* Enhanced gradient for fill with more vibrance */}
          <linearGradient id="ecgFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(239,68,68)" stopOpacity={isHovered ? "0.35" : "0.18"} />
            <stop offset="40%" stopColor="rgb(239,68,68)" stopOpacity={isHovered ? "0.22" : "0.1"} />
            <stop offset="100%" stopColor="rgba(239,68,68,0.02)" />
          </linearGradient>

          {/* Dynamic flowing gradient for the line */}
          <linearGradient id="ecgLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(239,68,68,0.3)" />
            <stop offset="15%" stopColor="rgb(220,38,38)" />
            <stop offset="40%" stopColor="rgb(239,68,68)" />
            <stop offset="50%" stopColor="rgb(248,113,113)" />
            <stop offset="60%" stopColor="rgb(239,68,68)" />
            <stop offset="85%" stopColor="rgb(220,38,38)" />
            <stop offset="100%" stopColor="rgba(239,68,68,0.3)" />
          </linearGradient>

          {/* Professional glow filter */}
          <filter id="ecgGlow">
            <feGaussianBlur stdDeviation={isHovered ? "2.5" : "1.5"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Medical grid pattern */}
          <pattern id="ecgGrid" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="none" />
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(239,68,68,0.05)" strokeWidth="0.15" />
          </pattern>
        </defs>

        {/* Grid background - medical ECG paper look */}
        <rect width="100" height="100" fill="url(#ecgGrid)" opacity="0.6" />

        {/* Baseline reference line - clear and visible */}
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="rgba(239,68,68,0.3)"
          strokeWidth="0.4"
          strokeDasharray="2,1.5"
        />

        {/* Professional baseline markers */}
        {[0, 20, 40, 60, 80, 100].map((pos) => (
          <line
            key={`marker-${pos}`}
            x1={pos}
            y1="48.5"
            x2={pos}
            y2="51.5"
            stroke="rgba(239,68,68,0.2)"
            strokeWidth="0.3"
          />
        ))}

        {/* Animated ECG fill - ultra-smooth with 16 keyframes */}
        <motion.path
          d={generateECGWave(0, amplitudeMultiplier)}
          fill="url(#ecgFillGrad)"
          animate={{
            d: [
              generateECGWave(0, amplitudeMultiplier),
              generateECGWave(0.06, amplitudeMultiplier),
              generateECGWave(0.12, amplitudeMultiplier),
              generateECGWave(0.18, amplitudeMultiplier),
              generateECGWave(0.24, amplitudeMultiplier),
              generateECGWave(0.3, amplitudeMultiplier),
              generateECGWave(0.36, amplitudeMultiplier),
              generateECGWave(0.42, amplitudeMultiplier),
              generateECGWave(0.48, amplitudeMultiplier),
              generateECGWave(0.54, amplitudeMultiplier),
              generateECGWave(0.6, amplitudeMultiplier),
              generateECGWave(0.66, amplitudeMultiplier),
              generateECGWave(0.72, amplitudeMultiplier),
              generateECGWave(0.78, amplitudeMultiplier),
              generateECGWave(0.84, amplitudeMultiplier),
              generateECGWave(0.9, amplitudeMultiplier),
            ],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Animated ECG line - bold and prominent */}
        <motion.path
          d={generateECGWave(0, amplitudeMultiplier)}
          stroke="url(#ecgLineGrad)"
          strokeWidth={isHovered ? "2.2" : "1.8"}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ecgGlow)"
          animate={{
            d: [
              generateECGWave(0, amplitudeMultiplier),
              generateECGWave(0.06, amplitudeMultiplier),
              generateECGWave(0.12, amplitudeMultiplier),
              generateECGWave(0.18, amplitudeMultiplier),
              generateECGWave(0.24, amplitudeMultiplier),
              generateECGWave(0.3, amplitudeMultiplier),
              generateECGWave(0.36, amplitudeMultiplier),
              generateECGWave(0.42, amplitudeMultiplier),
              generateECGWave(0.48, amplitudeMultiplier),
              generateECGWave(0.54, amplitudeMultiplier),
              generateECGWave(0.6, amplitudeMultiplier),
              generateECGWave(0.66, amplitudeMultiplier),
              generateECGWave(0.72, amplitudeMultiplier),
              generateECGWave(0.78, amplitudeMultiplier),
              generateECGWave(0.84, amplitudeMultiplier),
              generateECGWave(0.9, amplitudeMultiplier),
            ],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Enhanced pulsing indicator dots at R wave peaks */}
        {[0.27, 0.55, 0.82].map((pos, i) => (
          <motion.circle
            key={`r${i}`}
            cx={pos * 100}
            cy={isHovered ? "26" : "30"}
            r={isHovered ? "2" : "1.2"}
            fill="rgb(220,38,38)"
            opacity={isHovered ? "1" : "0.8"}
            filter="url(#ecgGlow)"
            animate={{
              r: isHovered ? [2, 4.2, 2] : [1.2, 3.2, 1.2],
              opacity: [isHovered ? 0.7 : 0.6, 1, isHovered ? 0.7 : 0.6],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated scanning cursor - monitor effect */}
        <motion.line
          x1="80"
          y1="20"
          x2="80"
          y2="80"
          stroke="rgba(239,68,68,0.6)"
          strokeWidth="1"
          filter="url(#ecgGlow)"
          animate={{
            x1: ["0", "100"],
            x2: ["0", "100"],
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
};

export default HeartbeatMonitor;


