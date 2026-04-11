import { motion } from "framer-motion";
import {
  Clock, Users, Building2, Zap, TrendingUp, TrendingDown, Search,
  CheckCircle2, Circle, CalendarDays, Bell, ArrowRight,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AnimatedCounter from "@/components/AnimatedCounter";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

const kpis = [
  { icon: Clock, label: "Hours Logged", value: 128, trend: 12, up: true },
  { icon: Users, label: "Applications", value: 24, trend: 8, up: true },
  { icon: Building2, label: "NGOs Joined", value: 5, trend: 2, up: true },
  { icon: Zap, label: "XP Points", value: 2450, trend: -3, up: false },
];

const chartData = [
  { month: "Jan", score: 65 }, { month: "Feb", score: 72 }, { month: "Mar", score: 68 },
  { month: "Apr", score: 78 }, { month: "May", score: 85 }, { month: "Jun", score: 91 },
];

const events = [
  { title: "Health Camp — Mumbai", date: "Apr 15", time: "9:00 AM" },
  { title: "Blood Drive — Delhi", date: "Apr 18", time: "10:00 AM" },
  { title: "Hygiene Workshop", date: "Apr 22", time: "2:00 PM" },
];

const notifications = [
  { title: "New match found!", desc: "HealthFirst NGO — 92% match", time: "2m ago", unread: true },
  { title: "Donation delivered", desc: "Medical supplies to RedCross", time: "1h ago", unread: true },
  { title: "Badge earned!", desc: "First 100 hours", time: "3h ago", unread: false },
  { title: "Event reminder", desc: "Health Camp tomorrow", time: "5h ago", unread: false },
];

const nextSteps = [
  { num: "01", task: "Complete profile verification", done: true },
  { num: "02", task: "Apply to 3 NGOs", done: true },
  { num: "03", task: "Log your first volunteer hours", done: false },
  { num: "04", task: "Share your first story", done: false },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, Alex</p>
        </motion.div>
        <motion.button
          className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2"
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsla(357,100%,44.5%,0.4)" }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          data-cursor-hover
        >
          Find Opportunities <ArrowRight size={16} strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* KPI Row */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            className="glass-card p-5 group"
            variants={stagger.item}
            whileHover={{ y: -3, borderColor: "hsla(357,100%,44.5%,0.25)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon size={20} strokeWidth={1.5} className="text-primary" />
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-success" : "text-destructive"}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}%
              </div>
            </div>
            <div className="text-3xl font-bold font-mono text-foreground">
              <AnimatedCounter value={kpi.value} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Chart */}
        <motion.div
          className="lg:col-span-2 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">NGO Match Analysis</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(357,100%,44.5%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(357,100%,44.5%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: "#1A1A1A", border: "1px solid #222", borderRadius: 12, color: "#F5F5F5" }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(357,100%,44.5%)" fill="url(#scoreGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Match */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Match</h3>
          <div className="text-center mb-4">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="hsl(357,100%,44.5%)"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 8 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-foreground">92</span>
            </div>
            <p className="font-semibold text-foreground">HealthFirst NGO</p>
            <p className="text-xs text-muted-foreground">Mumbai, India</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Proximity", value: 95 },
              { label: "Cause Fit", value: 88 },
              { label: "Availability", value: 92 },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{bar.label}</span>
                  <span className="font-mono text-foreground">{bar.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${bar.value}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Profile */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Profile Completion</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="16" fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 25 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-foreground">75%</span>
            </div>
            <div className="text-sm text-muted-foreground">3 of 4 steps completed</div>
          </div>
          <div className="space-y-2">
            {[
              { label: "Basic Info", done: true },
              { label: "Health Interests", done: true },
              { label: "Availability", done: true },
              { label: "Verification", done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                {item.done ? (
                  <CheckCircle2 size={14} strokeWidth={1.5} className="text-success" />
                ) : (
                  <Circle size={14} strokeWidth={1.5} className="text-muted-foreground" />
                )}
                <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Events */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.map((e) => (
              <motion.div
                key={e.title}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary transition-colors"
                whileHover={{ x: 3 }}
                data-cursor-hover
              >
                <CalendarDays size={16} strokeWidth={1.5} className="text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.date} • {e.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.map((n) => (
              <motion.div
                key={n.title}
                className="flex items-start gap-3 p-2 rounded-lg"
                whileHover={{ x: 3 }}
                data-cursor-hover
              >
                <div className="relative">
                  <Bell size={14} strokeWidth={1.5} className="text-muted-foreground mt-0.5" />
                  {n.unread && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.desc}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Next Steps */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">Next Steps</h3>
        <div className="flex flex-wrap gap-4">
          {nextSteps.map((s, i) => (
            <motion.div
              key={s.num}
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <span className="font-mono text-xs text-primary">{s.num}</span>
              {s.done ? (
                <CheckCircle2 size={14} className="text-success" />
              ) : (
                <Circle size={14} className="text-muted-foreground" />
              )}
              <span className={`text-sm ${s.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {s.task}
              </span>
              {i < nextSteps.length - 1 && (
                <ArrowRight size={12} className="text-muted-foreground ml-2" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
