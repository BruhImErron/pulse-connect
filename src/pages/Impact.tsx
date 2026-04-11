import { motion } from "framer-motion";
import { Share2, Trophy, Lock, Gift, Users, Building2, Clock, Flame, Leaf } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AnimatedCounter from "@/components/AnimatedCounter";

const metrics = [
  { emoji: "🎁", icon: Gift, value: 156, label: "Items Donated", context: "$2,340 value" },
  { emoji: "👥", icon: Users, value: 892, label: "People Helped", context: "across 12 countries" },
  { emoji: "🏢", icon: Building2, value: 5, label: "NGOs Supported", context: "3 active" },
  { emoji: "⏱️", icon: Clock, value: 128, label: "Hours Volunteered", context: "avg 8h/week" },
  { emoji: "🌱", icon: Leaf, value: 45, label: "Carbon Saved", context: "kg CO₂" },
  { emoji: "🔥", icon: Flame, value: 14, label: "Current Streak", context: "days" },
];

const badges = [
  { name: "First Steps", icon: "🌱", date: "Jan 2024", unlocked: true },
  { name: "100 Hours", icon: "⏱️", date: "Mar 2024", unlocked: true },
  { name: "Donor Hero", icon: "🎁", date: "Mar 2024", unlocked: true },
  { name: "Community Star", icon: "⭐", date: "Apr 2024", unlocked: true },
  { name: "Global Impact", icon: "🌍", date: null, unlocked: false },
  { name: "Mentor", icon: "🎓", date: null, unlocked: false },
  { name: "Streak Master", icon: "🔥", date: null, unlocked: false },
  { name: "Top 1%", icon: "💎", date: null, unlocked: false },
];

const timeline = [
  { type: "donation", desc: "Donated 50 medical kits to MedAid", time: "2 hours ago", color: "bg-primary" },
  { type: "volunteer", desc: "Completed health camp in Mumbai", time: "1 day ago", color: "bg-info" },
  { type: "badge", desc: "Earned Community Star badge", time: "2 days ago", color: "bg-warning" },
  { type: "match", desc: "Matched with CleanWater Corps", time: "3 days ago", color: "bg-success" },
  { type: "donation", desc: "Donated children's books", time: "5 days ago", color: "bg-primary" },
];

const heatmapData = Array.from({ length: 52 * 7 }, () => Math.random());

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const Impact = () => {
  return (
    <DashboardLayout>
      {/* Hero metric */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl font-heading font-bold text-foreground mb-2">
          <AnimatedCounter value={892} className="text-6xl font-heading font-bold" />
        </div>
        <p className="text-muted-foreground mb-4">lives touched through your contributions</p>
        <motion.button
          className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsla(357,100%,44.5%,0.4)" }}
          whileTap={{ scale: 0.97 }} data-cursor-hover
        >
          <Share2 size={16} strokeWidth={1.5} /> Share Impact
        </motion.button>
      </motion.div>

      {/* Impact grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        variants={stagger.container} initial="hidden" animate="visible"
      >
        {metrics.map(m => (
          <motion.div key={m.label} className="glass-card p-5" variants={stagger.item}
            whileHover={{ y: -3, borderColor: "hsla(357,100%,44.5%,0.25)" }}>
            <span className="text-2xl mb-2 block">{m.emoji}</span>
            <div className="text-2xl font-bold font-mono text-foreground">
              <AnimatedCounter value={m.value} />
            </div>
            <p className="text-sm text-foreground font-medium">{m.label}</p>
            <p className="text-xs text-muted-foreground">{m.context}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Streak heatmap */}
      <motion.div
        className="glass-card p-6 mb-12"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Flame size={20} className="text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Activity Streak</h2>
          <span className="font-mono text-sm text-primary">🔥 14 days</span>
        </div>
        <div className="flex gap-[3px] flex-wrap">
          {heatmapData.map((v, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: v > 0.7 ? "hsl(357,100%,44.5%)" : v > 0.4 ? "hsla(357,100%,44.5%,0.4)" : v > 0.15 ? "hsla(357,100%,44.5%,0.15)" : "hsl(var(--secondary))",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.002 }}
            />
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={20} className="text-primary" />
          <h2 className="text-lg font-heading font-semibold text-foreground">Achievements</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.name}
              className={`glass-card p-4 text-center relative ${!b.unlocked ? "opacity-50" : ""}`}
              whileHover={b.unlocked ? { y: -3, scale: 1.02 } : {}}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: b.unlocked ? 1 : 0.5, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              {!b.unlocked && <Lock size={14} className="absolute top-2 right-2 text-muted-foreground" />}
              <span className="text-3xl block mb-2">{b.icon}</span>
              <p className="text-sm font-semibold text-foreground">{b.name}</p>
              <p className="text-[10px] text-muted-foreground">{b.date || "Locked"}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-heading font-semibold text-foreground mb-6">Activity Timeline</h2>
        <div className="space-y-4 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
          {timeline.map((t, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <div className={`w-4 h-4 rounded-full ${t.color} z-10 mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{t.desc}</p>
                <p className="text-xs font-mono text-muted-foreground">{t.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Impact;
