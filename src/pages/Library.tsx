import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Search, Star } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const categories = ["All", "Nutrition", "Mental Health", "Hygiene", "Fitness", "Sleep"];
const catColors: Record<string, string> = {
  Nutrition: "bg-success/20 text-success",
  "Mental Health": "bg-info/20 text-info",
  Hygiene: "bg-warning/20 text-warning",
  Fitness: "bg-primary/20 text-primary",
  Sleep: "bg-accent text-accent-foreground",
};

const articles = [
  { emoji: "🥗", title: "10 Superfoods for Immunity", category: "Nutrition", recommended: true, readTime: "5 min", desc: "Boost your immune system with these nutrient-packed foods backed by science." },
  { emoji: "🧠", title: "Mindfulness for Beginners", category: "Mental Health", recommended: true, readTime: "8 min", desc: "Simple meditation techniques to reduce stress and improve focus." },
  { emoji: "🧴", title: "Hand Hygiene Best Practices", category: "Hygiene", recommended: false, readTime: "3 min", desc: "The WHO-recommended hand washing technique explained step by step." },
  { emoji: "🏃", title: "15-Minute HIIT Routine", category: "Fitness", recommended: true, readTime: "4 min", desc: "High-intensity interval training you can do anywhere, no equipment needed." },
  { emoji: "😴", title: "Sleep Hygiene 101", category: "Sleep", recommended: false, readTime: "6 min", desc: "Evidence-based tips for better sleep quality and consistency." },
  { emoji: "🍎", title: "Meal Prep for Busy Students", category: "Nutrition", recommended: false, readTime: "7 min", desc: "Quick and healthy meal prep ideas that fit a student budget." },
  { emoji: "💪", title: "Desk Stretches for Volunteers", category: "Fitness", recommended: false, readTime: "3 min", desc: "Prevent back pain and stiffness with these simple stretches." },
  { emoji: "🧘", title: "Managing Compassion Fatigue", category: "Mental Health", recommended: true, readTime: "10 min", desc: "How to recognize and cope with emotional burnout in volunteer work." },
];

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const Library = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? articles : articles.filter(a => a.category === activeCategory);

  return (
    <DashboardLayout>
      <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Library</h1>
        </div>
        <p className="text-sm text-muted-foreground">You've read 5/13 articles today</p>
      </motion.div>

      {/* Search */}
      <motion.div className="relative max-w-md mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors" placeholder="Search articles..." />
      </motion.div>

      {/* Category tabs */}
      <motion.div className="flex gap-2 mb-8 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {categories.map(c => (
          <motion.button
            key={c}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeCategory === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveCategory(c)}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
          >{c}</motion.button>
        ))}
      </motion.div>

      {/* Articles */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={stagger.container} initial="hidden" animate="visible" key={activeCategory}>
        {filtered.map(a => (
          <motion.div key={a.title} className="glass-card p-5 group" variants={stagger.item}
            whileHover={{ y: -3, borderColor: "hsla(357,100%,44.5%,0.25)" }}>
            <div className="flex items-start gap-4">
              <span className="text-4xl">{a.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${catColors[a.category] || "bg-secondary text-muted-foreground"}`}>{a.category}</span>
                  {a.recommended && (
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-primary/20 text-primary font-medium flex items-center gap-1">
                      <Star size={8} /> Recommended
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{a.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={12} /> {a.readTime}
                  </div>
                  <motion.button className="text-sm text-primary font-medium hover:underline" data-cursor-hover whileHover={{ x: 3 }}>
                    Read More →
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
};

export default Library;
