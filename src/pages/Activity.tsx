import { motion } from "framer-motion";
import { Zap, Clock, Users, Gift, Trophy, MapPin } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const activities = [
  { type: "volunteer", icon: Users, color: "bg-info", title: "Volunteered at Health Camp", desc: "HealthFirst NGO • Mumbai", time: "Today, 9:00 AM", hours: "4h" },
  { type: "donation", icon: Gift, color: "bg-primary", title: "Donated Medical Supplies", desc: "50 kits to MedAid International", time: "Yesterday, 2:30 PM", hours: null },
  { type: "achievement", icon: Trophy, color: "bg-warning", title: "Earned Community Star Badge", desc: "For 50+ volunteer interactions", time: "2 days ago", hours: null },
  { type: "volunteer", icon: Users, color: "bg-info", title: "Blood Drive Volunteer", desc: "Red Cross • Delhi Chapter", time: "3 days ago", hours: "6h" },
  { type: "donation", icon: Gift, color: "bg-primary", title: "Donated Children's Books", desc: "30 books to WellBeing Foundation", time: "5 days ago", hours: null },
  { type: "volunteer", icon: Users, color: "bg-info", title: "Hygiene Workshop Leader", desc: "CleanWater Corps • Training", time: "1 week ago", hours: "3h" },
  { type: "achievement", icon: Trophy, color: "bg-warning", title: "100 Hours Milestone!", desc: "Reached 100 volunteer hours", time: "1 week ago", hours: null },
  { type: "volunteer", icon: MapPin, color: "bg-success", title: "Joined New NGO", desc: "CleanWater Corps • Dhaka", time: "2 weeks ago", hours: null },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } },
};

const Activity = () => {
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
            { label: "This Week", value: "13h", icon: Clock },
            { label: "This Month", value: "47h", icon: Clock },
            { label: "Total", value: "128h", icon: Clock },
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
        <motion.div className="relative" variants={stagger.container} initial="hidden" animate="visible">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {activities.map((a, i) => (
              <motion.div key={i} className="flex items-start gap-4 relative" variants={stagger.item}>
                <div className={`w-10 h-10 rounded-full ${a.color} flex items-center justify-center z-10 shrink-0`}>
                  <a.icon size={16} strokeWidth={1.5} className="text-primary-foreground" />
                </div>
                <motion.div
                  className="flex-1 glass-card p-4"
                  whileHover={{ borderColor: "hsla(357,100%,44.5%,0.2)" }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    {a.hours && (
                      <span className="font-mono text-sm text-primary font-bold">{a.hours}</span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">{a.time}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Activity;
