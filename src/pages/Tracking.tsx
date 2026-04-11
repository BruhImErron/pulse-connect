import { motion } from "framer-motion";
import { Package, MapPin, Phone, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const statuses = ["pending", "picked_up", "in_delivery", "delivered"] as const;
const statusLabels = { pending: "📋 Pending", picked_up: "🚚 Picked Up", in_delivery: "🚗 In Delivery", delivered: "✅ Done" };
const statusColors: Record<string, string> = {
  pending: "bg-warning/20 text-warning",
  picked_up: "bg-info/20 text-info",
  in_delivery: "bg-primary/20 text-primary",
  delivered: "bg-success/20 text-success",
};

const deliveries = [
  { id: 1, title: "Winter Clothing Drive", ngo: "HealthFirst NGO", status: "in_delivery" as const, pickup: "Mumbai Central", delivery: "Rural Maharashtra", volunteer: "Raj Patel", rating: 4 },
  { id: 2, title: "Medical Supply Kit", ngo: "MedAid International", status: "picked_up" as const, pickup: "Warehouse #3", delivery: "Nairobi Central Hospital", volunteer: "Sarah Kim", rating: 5 },
  { id: 3, title: "Children's Books", ngo: "WellBeing Foundation", status: "delivered" as const, pickup: "Library Depot", delivery: "São Paulo Community Center", volunteer: "Luis Hernandez", rating: 5 },
  { id: 4, title: "Hygiene Packs", ngo: "CleanWater Corps", status: "pending" as const, pickup: "Distribution Center", delivery: "Dhaka Relief Camp", volunteer: "TBD", rating: 0 },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const Tracking = () => {
  return (
    <DashboardLayout>
      <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Package size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Delivery Tracking</h1>
        </div>
      </motion.div>

      <motion.div className="flex gap-3 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {["All", "Active", "Completed"].map((t, i) => (
          <motion.button key={t}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"} transition-colors`}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
          >{t}</motion.button>
        ))}
      </motion.div>

      <motion.div className="space-y-4" variants={stagger.container} initial="hidden" animate="visible">
        {deliveries.map(d => {
          const statusIdx = statuses.indexOf(d.status);
          return (
            <motion.div
              key={d.id} className="glass-card p-6 relative overflow-hidden" variants={stagger.item}
              whileHover={{ borderColor: "hsla(357,100%,44.5%,0.25)" }}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusIdx === 3 ? "bg-success" : statusIdx === 2 ? "bg-primary" : statusIdx === 1 ? "bg-info" : "bg-warning"}`} />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{d.title}</h3>
                  <p className="text-xs text-muted-foreground">{d.ngo}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[d.status]}`}>
                  {statusLabels[d.status]}
                </span>
              </div>

              {/* Timeline */}
              <div className="flex items-center justify-between mb-6 px-4">
                {statuses.map((s, i) => (
                  <div key={s} className="flex items-center flex-1">
                    <motion.div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        i <= statusIdx ? "border-primary bg-primary" : "border-border bg-background"
                      }`}
                      animate={i === statusIdx ? { scale: [1, 1.3, 1], boxShadow: ["0 0 0 0 hsla(357,100%,44.5%,0.4)", "0 0 0 8px hsla(357,100%,44.5%,0)", "0 0 0 0 hsla(357,100%,44.5%,0)"] } : {}}
                      transition={{ duration: 1.5, repeat: i === statusIdx ? Infinity : 0 }}
                    >
                      {i < statusIdx && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </motion.div>
                    {i < statuses.length - 1 && (
                      <div className="flex-1 h-0.5 mx-1">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: i < statusIdx ? "hsl(var(--primary))" : "hsl(var(--border))" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8, delay: i * 0.2 }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Pickup</p>
                  <div className="flex items-center gap-1 text-sm text-foreground"><MapPin size={12} className="text-primary" /> {d.pickup}</div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Delivery</p>
                  <div className="flex items-center gap-1 text-sm text-foreground"><MapPin size={12} className="text-primary" /> {d.delivery}</div>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Volunteer</p>
                  <p className="text-sm text-foreground">{d.volunteer}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">Rating</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} strokeWidth={1.5} className={i < d.rating ? "text-warning fill-warning" : "text-muted-foreground"} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} data-cursor-hover>Update Status</motion.button>
                <motion.button className="px-4 py-2 rounded-xl border border-primary/40 text-primary text-sm font-medium hover:bg-primary/5"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} data-cursor-hover>
                  <Phone size={14} className="inline mr-1" /> Contact
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </DashboardLayout>
  );
};

export default Tracking;
