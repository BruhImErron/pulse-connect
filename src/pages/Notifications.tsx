import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, Gift, UserCheck, Trophy, Users, Package, Info } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  donation: { icon: Gift, color: "bg-primary" },
  volunteer: { icon: UserCheck, color: "bg-info" },
  achievement: { icon: Trophy, color: "bg-warning" },
  follow: { icon: Users, color: "bg-success" },
  delivery: { icon: Package, color: "bg-accent" },
  system: { icon: Info, color: "bg-secondary" },
};

const initialNotifications = [
  { id: 1, type: "donation", title: "Donation Received", body: "Your medical kits have been delivered to MedAid", time: "2m ago", read: false },
  { id: 2, type: "volunteer", title: "Application Accepted", body: "HealthFirst NGO accepted your volunteer application", time: "1h ago", read: false },
  { id: 3, type: "achievement", title: "Badge Earned! 🏆", body: "You earned the Community Star badge", time: "3h ago", read: false },
  { id: 4, type: "follow", title: "New Follower", body: "Priya Sharma started following you", time: "5h ago", read: true },
  { id: 5, type: "delivery", title: "Delivery Update", body: "Your donation is in transit to Nairobi", time: "8h ago", read: true },
  { id: 6, type: "system", title: "Profile Reminder", body: "Complete your verification to unlock all features", time: "1d ago", read: true },
  { id: 7, type: "donation", title: "Thank You!", body: "CleanWater Corps thanked you for your donation", time: "2d ago", read: true },
  { id: 8, type: "achievement", title: "Milestone Reached", body: "You've helped 500+ people!", time: "3d ago", read: true },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");
  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: number) => {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
  };

  const filters = ["All", "Unread", "Donations", "Volunteer", "Achievements"];
  const filtered = notifications.filter(n => {
    if (filter === "Unread") return !n.read;
    if (filter === "Donations") return n.type === "donation";
    if (filter === "Volunteer") return n.type === "volunteer";
    if (filter === "Achievements") return n.type === "achievement";
    return true;
  });

  return (
    <DashboardLayout>
      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell size={24} strokeWidth={1.5} className="text-primary" />
            <h1 className="text-3xl font-heading font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <motion.span
                className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          <motion.button
            className="px-4 py-2 rounded-xl border border-primary/40 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
            onClick={markAllRead}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} data-cursor-hover
          >
            Mark All Read
          </motion.button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {filters.map(f => (
            <motion.button key={f}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
            >{f}</motion.button>
          ))}
        </div>

        {/* Notification list */}
        <div className="space-y-2">
          {filtered.map((n, i) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
                  !n.read ? "bg-card border border-primary/10" : "hover:bg-secondary/50"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(n.id)}
                whileHover={{ x: 3 }}
                data-cursor-hover
              >
                <div className={`w-9 h-9 rounded-full ${config.color} flex items-center justify-center shrink-0`}>
                  <Icon size={16} strokeWidth={1.5} className="text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{n.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{n.body}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{n.time}</span>
                  {!n.read ? (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  ) : (
                    <Check size={12} className="text-muted-foreground" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Notifications;
