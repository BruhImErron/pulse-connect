import { useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Zap, Clock, Users, Gift, Trophy, MapPin, Loader2, BookOpen } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { api } from "@/lib/api";

const defaultActivities = [
  { id: "default-1", type: "volunteer", icon: Users, color: "bg-info", title: "Volunteered at Health Camp", description: "HealthFirst NGO • Mumbai", time: "2026-04-12T09:00:00Z", hours: "4h" },
  { id: "default-2", type: "donation", icon: Gift, color: "bg-primary", title: "Donated Medical Supplies", description: "50 kits to MedAid International", time: "2026-04-11T14:30:00Z", hours: null },
  { id: "default-3", type: "achievement", icon: Trophy, color: "bg-warning", title: "Earned Community Star Badge", description: "For 50+ volunteer interactions", time: "2026-04-10T16:00:00Z", hours: null },
  { id: "default-4", type: "volunteer", icon: Users, color: "bg-info", title: "Blood Drive Volunteer", description: "Red Cross • Delhi Chapter", time: "2026-04-09T11:00:00Z", hours: "6h" },
  { id: "default-5", type: "donation", icon: Gift, color: "bg-primary", title: "Donated Children's Books", description: "30 books to WellBeing Foundation", time: "2026-04-07T09:30:00Z", hours: null },
  { id: "default-6", type: "volunteer", icon: Users, color: "bg-info", title: "Hygiene Workshop Leader", description: "CleanWater Corps • Training", time: "2026-04-05T13:00:00Z", hours: "3h" },
  { id: "default-7", type: "achievement", icon: Trophy, color: "bg-warning", title: "100 Hours Milestone!", description: "Reached 100 volunteer hours", time: "2026-04-04T08:00:00Z", hours: null },
  { id: "default-8", type: "volunteer", icon: MapPin, color: "bg-success", title: "Joined New NGO", description: "CleanWater Corps • Dhaka", time: "2026-04-02T10:00:00Z", hours: null },
];

const activityIcons: Record<string, ComponentType<any>> = {
  volunteer: Users,
  donation: Gift,
  achievement: Trophy,
  application: MapPin,
  post: BookOpen,
  like: Clock,
};

const activityColors: Record<string, string> = {
  volunteer: "bg-info",
  donation: "bg-primary",
  achievement: "bg-warning",
  application: "bg-accent",
  post: "bg-secondary",
  like: "bg-success",
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
};

const Activity = () => {
  const { data: activityData, isLoading, isError } = useQuery({
    queryKey: ["activity"],
    queryFn: () => api.activity.list().then((res) => res.data),
  });

  const activities = activityData?.activities || defaultActivities;
  const stats = activityData?.stats || { thisWeek: 12, thisMonth: 34, total: 142 };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString();
  };
  return (
    <DashboardLayout>
      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-8">
          <Zap size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Activity</h1>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "This Week", value: `${stats.thisWeek}h`, icon: Clock },
            { label: "This Month", value: `${stats.thisMonth}h`, icon: Clock },
            { label: "Total", value: `${stats.total}h`, icon: Clock },
          ].map((s, i) => (
            <motion.div key={s.label} className="glass-card p-4 text-center"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <s.icon size={16} className="text-primary mx-auto mb-1" />
              <p className="font-mono text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Unable to load activity right now. Please refresh or try again later.</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No activity yet. Start volunteering to see your impact!</p>
          </div>
        ) : (
          <motion.div className="relative" variants={stagger.container} initial="hidden" animate="visible">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {activities.map((a, i) => {
                const IconComponent = activityIcons[a.type];
                return (
                  <motion.div key={a.id} className="flex items-start gap-4 relative" variants={stagger.item}>
                    <div className={`w-10 h-10 rounded-full ${activityColors[a.type]} flex items-center justify-center z-10 shrink-0`}>
                      <IconComponent size={16} strokeWidth={1.5} className="text-primary-foreground" />
                    </div>
                    <motion.div
                      className="flex-1 glass-card p-4"
                      whileHover={{ borderColor: "hsla(357,100%,44.5%,0.2)" }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{a.title}</p>
                          <p className="text-xs text-muted-foreground">{a.description}</p>
                        </div>
                        {a.hours && (
                          <span className="font-mono text-sm text-primary font-bold">{a.hours}h</span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground mt-2">{formatTime(a.time)}</p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Activity;
