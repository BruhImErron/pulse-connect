import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, MapPin, Brain, Search, Star, Loader2, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Ngo } from "@/lib/api";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};



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
        {ngos?.map((ngo, index) => (
          <motion.div
            key={ngo.id}
            className="glass-card p-6 relative group"
            variants={stagger.item}
            whileHover={{ y: -4, borderColor: "hsla(357,100%,44.5%,0.25)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {index === 0 && (
              <motion.div
                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center gap-1"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star size={10} /> Best Match
              </motion.div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div className={index === 0 ? "mt-8" : ""}>
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
                <span className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-bold ${
                  ngo.score >= 85 ? "text-green-600" : ngo.score >= 70 ? "text-yellow-600" : "text-red-600"
                }`}>
                  {ngo.score}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ngo.description}</p>

            <div className="flex gap-2 mb-4">
              {ngo.tags.map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-accent text-accent-foreground text-[11px] font-medium">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <motion.button
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleApply(ngo.id, "Volunteer")}
                disabled={applyMutation.isPending}
                data-cursor-hover
              >
                {applyMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Apply to Volunteer"
                )}
              </motion.button>
              <motion.button
                className="p-2.5 rounded-xl border border-border bg-card text-foreground"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-cursor-hover
              >
                <Brain size={16} strokeWidth={1.5} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
};

export default NgoMatches;
