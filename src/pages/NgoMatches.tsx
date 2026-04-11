import { motion } from "framer-motion";
import { Users, MapPin, Brain, Search, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const ngos = [
  {
    name: "HealthFirst NGO", location: "Mumbai, India", score: 92, best: true,
    desc: "Providing healthcare access to underserved communities across rural India.",
    tags: ["Primary Care", "Nutrition"], 
    breakdown: { proximity: 95, cause: 88, availability: 92, recency: 85 },
    opportunities: [
      { title: "Community Health Worker", hours: "20h/week" },
      { title: "Medical Camp Organizer", hours: "10h/week" },
    ],
  },
  {
    name: "MedAid International", location: "Nairobi, Kenya", score: 87, best: false,
    desc: "Fighting preventable diseases through education and medical supplies distribution.",
    tags: ["Disease Prevention", "Education"],
    breakdown: { proximity: 72, cause: 95, availability: 88, recency: 90 },
    opportunities: [
      { title: "Health Educator", hours: "15h/week" },
      { title: "Supply Chain Volunteer", hours: "8h/week" },
    ],
  },
  {
    name: "WellBeing Foundation", location: "São Paulo, Brazil", score: 81, best: false,
    desc: "Mental health support and awareness programs for youth in urban areas.",
    tags: ["Mental Health", "Youth"],
    breakdown: { proximity: 65, cause: 92, availability: 78, recency: 88 },
    opportunities: [
      { title: "Counseling Assistant", hours: "12h/week" },
    ],
  },
  {
    name: "CleanWater Corps", location: "Dhaka, Bangladesh", score: 76, best: false,
    desc: "Ensuring clean water access and hygiene education in flood-prone regions.",
    tags: ["Water", "Hygiene"],
    breakdown: { proximity: 58, cause: 85, availability: 82, recency: 79 },
    opportunities: [
      { title: "Water Quality Tester", hours: "10h/week" },
      { title: "Community Trainer", hours: "5h/week" },
    ],
  },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const scoreColor = (s: number) => s >= 85 ? "text-success" : s >= 70 ? "text-warning" : "text-destructive";

const NgoMatches = () => {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Brain size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Your NGO Matches</h1>
        </div>
        <p className="text-sm text-muted-foreground">Ranked by AI matching engine</p>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        className="flex items-center gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative flex-1 max-w-md">
          <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors"
            placeholder="Search NGOs..."
          />
        </div>
        {["All", "Primary Care", "Mental Health", "Nutrition", "Hygiene"].map(t => (
          <motion.button
            key={t}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              t === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            data-cursor-hover
          >
            {t}
          </motion.button>
        ))}
      </motion.div>

      {/* NGO Cards */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {ngos.map((ngo) => (
          <motion.div
            key={ngo.name}
            className="glass-card p-6 relative group"
            variants={stagger.item}
            whileHover={{ y: -4, borderColor: "hsla(357,100%,44.5%,0.25)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {ngo.best && (
              <motion.div
                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star size={10} /> Best Match
              </motion.div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className={ngo.best ? "mt-8" : ""}>
                <h3 className="text-lg font-semibold text-foreground">{ngo.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin size={12} strokeWidth={1.5} /> {ngo.location}
                </div>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5" />
                  <motion.circle
                    cx="18" cy="18" r="16" fill="none"
                    stroke={ngo.score >= 85 ? "hsl(var(--success))" : ngo.score >= 70 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                    strokeWidth="2.5"
                    strokeDasharray="100"
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 100 - ngo.score }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-bold ${scoreColor(ngo.score)}`}>
                  {ngo.score}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ngo.desc}</p>

            <div className="flex gap-2 mb-4">
              {ngo.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-[11px] font-medium">
                  {t}
                </span>
              ))}
            </div>

            {/* Breakdown bars */}
            <div className="space-y-2 mb-4">
              {Object.entries(ngo.breakdown).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-muted-foreground capitalize">{key}</span>
                    <span className="font-mono text-foreground">{val}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Opportunities */}
            <div className="space-y-2 mb-4">
              {ngo.opportunities.map(o => (
                <div key={o.title} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-sm text-foreground">{o.title}</span>
                  <span className="text-xs font-mono text-muted-foreground">{o.hours}</span>
                </div>
              ))}
            </div>

            <motion.button
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              whileHover={{ scale: 1.01, boxShadow: "0 0 25px hsla(357,100%,44.5%,0.3)" }}
              whileTap={{ scale: 0.98 }}
              data-cursor-hover
            >
              Apply to Volunteer
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
};

export default NgoMatches;
