import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useUserProfile } from "@/contexts/UserContext";
import neuralLayer from "@/assets/neural-layer.png";

interface BiometricWireframeProps {
  className?: string;
  activityData?: {
    heartRate: number;
    steps: number;
    calories: number;
    activeMinutes: number;
  };
}

const defaultActivityData = {
  heartRate: 72,
  steps: 8432,
  calories: 2340,
  activeMinutes: 45,
};

type LayerKey = "neural" | "circulatory" | "skeletal";

const LAYERS: Record<LayerKey, {
  label: string;
  layer: string;
  status: string;
  description: string;
  color: string;
  activeThreshold: number;
}> = {
  neural: {
    label: "NEURAL SYSTEM",
    layer: "LAYER 01",
    status: "RESEARCH APPLIED",
    description: "Your reading activity primes neural pathways and research flow.",
    color: "#4169E1",
    activeThreshold: 1,
  },
  circulatory: {
    label: "CIRCULATORY SYSTEM",
    layer: "LAYER 02",
    status: "DONATIONS VERIFIED",
    description: "Your donations pulse through the network to fuel vital community support.",
    color: "#FF073A",
    activeThreshold: 1,
  },
  skeletal: {
    label: "SKELETAL SYSTEM",
    layer: "LAYER 03",
    status: "FIELD HOURS COMPLETE",
    description: "Your volunteer hours form the structural backbone of field operations.",
    color: "#DAA520",
    activeThreshold: 1,
  },
};

const RIBS_PATHS = [
  "M135 140 Q150 155 165 140",
  "M135 165 Q150 180 165 165",
  "M135 190 Q150 205 165 190",
  "M135 215 Q150 230 165 215",
  "M135 240 Q150 255 165 240",
  "M135 265 Q150 280 165 265",
];

export const BiometricWireframe = ({
  className = "",
  activityData = defaultActivityData,
}: BiometricWireframeProps) => {
  const { profile } = useUserProfile();
  const [activeLayer, setActiveLayer] = useState<LayerKey | null>(null);

  const isActive = (key: LayerKey): boolean => {
    switch (key) {
      case "neural": return profile.metrics.articlesRead > LAYERS.neural.activeThreshold;
      case "circulatory": return profile.metrics.donations > LAYERS.circulatory.activeThreshold;
      case "skeletal": return profile.metrics.volunteerHours > LAYERS.skeletal.activeThreshold;
      default: return false;
    }
  };

  const getValue = (key: LayerKey): number => {
    switch (key) {
      case "neural": return profile.metrics.articlesRead;
      case "circulatory": return profile.metrics.donations;
      case "skeletal": return profile.metrics.volunteerHours;
      default: return 0;
    }
  };

  const activeLayersCount = (Object.keys(LAYERS) as LayerKey[]).filter(isActive).length;

  const closePanel = () => setActiveLayer(null);

  const handleLayerClick = (layer: LayerKey, e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    if (!isActive(layer) || activeLayer) return;
    setActiveLayer(layer);
  };

  const handleSvgClick = () => {
    if (activeLayer) closePanel();
  };

  const LayerMetricsPanel = ({ layer }: { layer: LayerKey }) => {
    const layerData = LAYERS[layer];
    const value = getValue(layer);
    return (
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{layerData.layer}</p>
            <h3 className="text-xl font-semibold text-foreground">{layerData.label}</h3>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary-foreground">Live</span>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{layerData.description}</p>
        <div className="rounded-[1.5rem] border border-primary/10 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-primary">
            <span>Activity</span>
            <span>{value}</span>
          </div>
          <div className="h-20 rounded-xl bg-gradient-to-r from-primary/20 to-transparent flex items-center justify-center">
            <span className="text-primary font-mono">Active</span>
          </div>
        </div>
        <div className="text-xs text-primary/80 text-center">{layerData.status}</div>
      </div>
    );
  };

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-primary/20 bg-card/80 p-6 shadow-[0_0_80px_rgba(227,0,15,0.08)] ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(227,0,15,0.2),transparent_45%),linear-gradient(180deg,rgba(227,0,15,0.06),transparent_45%)]" />
      <div className="relative z-10 space-y-6">
        <div className="mb-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-micro text-primary">Impact anatomy map</p>
            <h2 className="mt-2 text-3xl font-heading font-semibold text-foreground">Unified anatomy layers</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Interactive human anatomy visualization. Hover systems for glow, click active layers for metrics.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary">
            {activeLayersCount} active layers
          </span>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Anatomy SVG */}
          <motion.svg
            viewBox="0 0 300 600"
            className="w-full max-w-[400px] mx-auto block border border-white/20 rounded-2xl p-8 bg-[rgba(255,255,255,0.03)] cursor-pointer"
            onClick={handleSvgClick}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Body Outline */}
            <g opacity="0.8" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Head */}
              <ellipse cx="150" cy="60" rx="45" ry="50" />
              {/* Torso */}
              <path d="M105 110 L120 450 L180 450 L195 110" />
              <path d="M135 110 Q150 250 165 110" />
              {/* Arms */}
              <path d="M105 130 Q80 250 85 350 Q95 420 110 450" />
              <path d="M195 130 Q220 250 215 350 Q205 420 190 450" />
              {/* Legs */}
              <path d="M130 450 Q125 520 135 580" />
              <path d="M170 450 Q175 520 165 580" />
            </g>

            {/* Skeletal Layer */}
            <g
              opacity={isActive('skeletal') ? 0.9 : 0.3}
              fill="none"
              stroke="#DAA520"
              strokeWidth="5"
              strokeLinecap="round"
              onClick={(e) => handleLayerClick('skeletal', e)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {/* Spine */}
              <path d="M148 80 Q150 200 152 400 Q150 500 150 540" strokeWidth="8" />
              {/* Ribs */}
              {RIBS_PATHS.map((path, i) => (
                <path key={`rib-${i}`} d={path} strokeWidth="3" opacity="0.8" />
              ))}
              {/* Arms */}
              <path d="M110 150 L95 320 L105 400" />
              <path d="M190 150 L205 320 L195 400" />
              {/* Legs */}
              <path d="M135 455 L130 530 L135 570" />
              <path d="M165 455 L170 530 L165 570" />
            </g>

            {/* Circulatory Layer */}
            <g
              opacity={isActive('circulatory') ? 0.85 : 0.25}
              fill="none"
              stroke="#FF073A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={isActive('circulatory') ? "0" : "5,5"}
              onClick={(e) => handleLayerClick('circulatory', e)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {/* Heart */}
              <path d="M142 250 Q150 280 158 250 Q150 220 142 250" strokeWidth="6" fill="rgba(255,7,58,0.2)" />
              {/* Aorta */}
              <path d="M150 245 L148 180 L140 160 L155 160 L152 180" strokeWidth="5" />
              {/* Arteries */}
              <path d="M152 280 L162 380 L172 460 L182 510" />
              <path d="M148 280 L138 380 L128 460 L118 510" />
              {/* Legs */}
              <path d="M150 520 L152 570" />
            </g>

            {/* Neural Layer */}
            <g
              opacity={isActive('neural') ? 0.9 : 0.3}
              fill="none"
              stroke="#4169E1"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="4,2"
              onClick={(e) => handleLayerClick('neural', e)}
              style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            >
              {/* Brain */}
              <ellipse cx="150" cy="55" rx="38" ry="28" strokeWidth="4" />
              {/* Neurons */}
              <path d="M135 50 Q125 30 115 50 Q125 70 135 90" />
              <path d="M165 50 Q175 30 185 50 Q175 70 165 90" />
              <path d="M130 70 Q120 120 130 170 Q150 200 160 170 Q170 120 160 70" />
              <path d="M140 210 L130 280 L140 340" />
              <path d="M160 210 L170 280 L160 340" />
              <path d="M150 360 Q165 430 155 480 Q145 430 150 360" />
            </g>
          </motion.svg>
        </div>

        <AnimatePresence>
          {activeLayer && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="relative mx-auto max-w-md"
            >
              <button
                className="absolute -right-3 -top-3 z-20 rounded-full bg-background/90 backdrop-blur-sm border border-primary/30 p-1.5 text-primary shadow-xl hover:bg-primary hover:text-white transition-all"
                onClick={closePanel}
              >
                ×
              </button>
              <LayerMetricsPanel layer={activeLayer} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

