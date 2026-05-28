import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Share2, Trophy, Lock, Gift, Users, Clock, Flame, Leaf, Loader2, Activity } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AnimatedCounter from "@/components/AnimatedCounter";
import { BiometricWireframe } from "@/components/BiometricWireframe";
import { api } from "@/lib/api";

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
  { type: "volunteer", desc: "Completed a coastal health camp in Cebu", time: "1 day ago", color: "bg-info" },
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
  const { data: impactData, isLoading, isError, error } = useQuery({
    queryKey: ["impact"],
    queryFn: () => api.impact.get().then((res) => res.data),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-lg font-semibold text-foreground">Unable to load impact data</p>
          <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unexpected error"}</p>
        </div>
      </DashboardLayout>
    );
  }

  const totalImpact = impactData
    ? (impactData.itemsDonated ?? 0) + (impactData.hoursVolunteered ?? 0) + (impactData.ngosSupported ?? 0) * 3
    : 0;

  const metrics = impactData
    ? [
        { emoji: "🎁", icon: Gift, value: impactData.itemsDonated ?? 0, label: "Items Donated", context: "total donated" },
        { emoji: "👥", icon: Users, value: impactData.ngosSupported ?? 0, label: "NGOs Supported", context: "active partnerships" },
        { emoji: "⏱️", icon: Clock, value: impactData.hoursVolunteered ?? 0, label: "Hours Volunteered", context: "time contributed" },
        { emoji: "🌱", icon: Leaf, value: impactData.carbonSaved ?? 0, label: "Carbon Saved", context: "kg CO₂ reduced" },
        { emoji: "🔥", icon: Flame, value: impactData.currentStreak ?? 0, label: "Current Streak", context: "days active" },
        { emoji: "⭐", icon: Trophy, value: impactData.xpPoints ?? 0, label: "XP Points", context: `Level ${impactData.level ?? 1}` },
      ]
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <motion.section
          className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="glass-card relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(227,0,15,0.15),transparent_52%)]" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-primary">
                <Activity className="h-3.5 w-3.5" />
                Live body of impact
              </div>
              <div className="mb-2 text-6xl font-heading font-bold text-foreground">
                <AnimatedCounter value={totalImpact} className="text-6xl font-heading font-bold" />
              </div>
              <p className="mb-5 max-w-md text-muted-foreground">lives touched through your contributions across local care routes, response hubs, and trusted NGO partnerships.</p>
              <motion.button
                className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsla(357,100%,44.5%,0.4)" }}
                whileTap={{ scale: 0.97 }}
                data-cursor-hover
                data-impact-action
              >
                <Share2 size={16} strokeWidth={1.5} /> Share Impact
              </motion.button>
            </div>
          </div>

          <BiometricWireframe
            activityData={{
              heartRate: 72 + ((impactData?.currentStreak ?? 0) % 18),
              steps: (impactData?.itemsDonated ?? 0) * 24 + 6400,
              calories: (impactData?.xpPoints ?? 0) + 1800,
              activeMinutes: (impactData?.hoursVolunteered ?? 0) + 32,
            }}
          />
        </motion.section>

        <motion.div className="grid grid-cols-2 gap-4 lg:grid-cols-3" variants={stagger.container} initial="hidden" animate="visible">
          {metrics.map((metric) => (
            <motion.div
              key={metric.label}
              className="glass-card p-5"
              variants={stagger.item}
              whileHover={{ y: -3, borderColor: "hsla(357,100%,44.5%,0.25)" }}
            >
              <span className="mb-2 block text-2xl">{metric.emoji}</span>
              <div className="text-2xl font-bold text-foreground">
                <AnimatedCounter value={metric.value} />
              </div>
              <p className="text-sm font-medium text-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground">{metric.context}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <Flame size={20} className="text-primary" />
            <h2 className="text-lg font-heading font-semibold text-foreground">Activity Streak</h2>
            <span className="font-mono text-sm text-primary">🔥 14 days</span>
          </div>
          <div className="flex flex-wrap gap-[3px]">
            {heatmapData.map((value, index) => (
              <motion.div
                key={index}
                className="h-3 w-3 rounded-sm"
                style={{
                  backgroundColor:
                    value > 0.7
                      ? "hsl(357,100%,44.5%)"
                      : value > 0.4
                        ? "hsla(357,100%,44.5%,0.4)"
                        : value > 0.15
                          ? "hsla(357,100%,44.5%,0.15)"
                          : "hsl(var(--secondary))",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.002 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="mb-6 flex items-center gap-3">
            <Trophy size={20} className="text-primary" />
            <h2 className="text-lg font-heading font-semibold text-foreground">Achievements</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.name}
                className={`glass-card relative p-4 text-center ${!badge.unlocked ? "opacity-50" : ""}`}
                whileHover={badge.unlocked ? { y: -3, scale: 1.02 } : {}}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: badge.unlocked ? 1 : 0.5, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {!badge.unlocked && <Lock size={14} className="absolute right-2 top-2 text-muted-foreground" />}
                <span className="mb-2 block text-3xl">{badge.icon}</span>
                <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                <p className="text-[10px] text-muted-foreground">{badge.date || "Locked"}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="mb-6 text-lg font-heading font-semibold text-foreground">Activity Timeline</h2>
          <div className="relative space-y-4">
            <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
            {timeline.map((item, index) => (
              <motion.div
                key={`${item.type}-${index}`}
                className="relative flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <div className={`z-10 mt-0.5 h-4 w-4 rounded-full ${item.color}`} />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item.desc}</p>
                  <p className="text-xs font-mono text-muted-foreground">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Impact;