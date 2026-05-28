import { motion } from "framer-motion";
import { Gift, MapPin, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const categories = [
  { emoji: "👕", label: "Clothes" }, { emoji: "🍎", label: "Food" },
  { emoji: "📚", label: "Books" }, { emoji: "💊", label: "Medical" },
  { emoji: "🧴", label: "Hygiene" }, { emoji: "💻", label: "Electronics" },
  { emoji: "📦", label: "Other" },
];

const requests = [
  { title: "Winter Clothing Drive", ngo: "HealthFirst NGO", location: "Mumbai", urgency: "critical", desc: "Urgent need for warm clothes for 200+ families in rural areas.", progress: 35, category: "Clothes", qty: "500 items", donationUrl: "https://www.redcross.org/donate" },
  { title: "Medical Supply Kit", ngo: "MedAid International", location: "Nairobi", urgency: "critical", desc: "Essential medical supplies for community health centers.", progress: 62, category: "Medical", qty: "100 kits", donationUrl: "https://www.doctorswithoutborders.org/donate" },
  { title: "Children's Books", ngo: "WellBeing Foundation", location: "São Paulo", urgency: "regular", desc: "Educational books for after-school programs.", progress: 78, category: "Books", qty: "300 books", donationUrl: "https://www.savethechildren.org/us/donate" },
  { title: "Hygiene Packs", ngo: "CleanWater Corps", location: "Dhaka", urgency: "regular", desc: "Soap, toothbrush, and sanitizer packs for flood victims.", progress: 45, category: "Hygiene", qty: "250 packs", donationUrl: "https://www.unicef.org/donate" },
  { title: "Mobile Clinic Support", ngo: "Rural Health Access", location: "Cape Town", urgency: "critical", desc: "Funds needed for mobile clinics serving remote villages.", progress: 48, category: "Medical", qty: "10 clinics", donationUrl: "https://www.oxfam.org/en/donate" },
  { title: "Vaccine Outreach", ngo: "Community Health Network", location: "Lagos", urgency: "critical", desc: "Support vaccination drives and health education campaigns.", progress: 60, category: "Medical", qty: "4 outreach teams", donationUrl: "https://www.gavi.org/donate" },
  { title: "Maternal Health Kits", ngo: "Maternal Care Initiative", location: "Manila", urgency: "regular", desc: "Safe birth kits and prenatal supplies for pregnant families.", progress: 52, category: "Medical", qty: "200 kits", donationUrl: "https://www.unfpa.org/donate" },
  { title: "Mental Health Support", ngo: "WellBeing Foundation", location: "São Paulo", urgency: "regular", desc: "Counseling and support resources for youth mental health.", progress: 70, category: "Mental Health", qty: "120 sessions", donationUrl: "https://www.nami.org/Get-Involved" },
  { title: "Nutrition Care Packs", ngo: "HealthFirst NGO", location: "Mumbai", urgency: "critical", desc: "Healthy meal packs for families in food-insecure communities.", progress: 40, category: "Food", qty: "800 meals", donationUrl: "https://www.actionagainsthunger.org/donate" },
  { title: "Health Education Campaign", ngo: "CleanWater Corps", location: "Dhaka", urgency: "regular", desc: "Community workshops on hygiene, sanitation, and disease prevention.", progress: 82, category: "Hygiene", qty: "15 programs", donationUrl: "https://www.wateraid.org/en/donate" },
  { title: "Telehealth Access Fund", ngo: "TechHealth Initiative", location: "Lagos", urgency: "regular", desc: "Support remote health consultations with low-income patients.", progress: 30, category: "Electronics", qty: "60 devices", donationUrl: "https://www.msf.org/donate" },
  { title: "Emergency Medical Response", ngo: "Philippine Red Cross", location: "Philippines", urgency: "critical", desc: "Rapid emergency response funding for disaster-affected communities.", progress: 58, category: "Medical", qty: "5 emergency teams", donationUrl: "https://redcross.org.ph/donate/" },
];

const urgencyColors: Record<string, string> = {
  critical: "bg-destructive text-primary-foreground",
  regular: "bg-secondary text-muted-foreground",
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const Donations = () => {
  return (
    <DashboardLayout>
      <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Gift size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Donate Items</h1>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
      >
        {["All", "🚨 Critical", "Regular"].map((t, i) => (
          <motion.button
            key={t}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"} transition-colors`}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
          >
            {t}
          </motion.button>
        ))}
      </motion.div>

      {/* Categories */}
      <motion.div
        className="flex gap-2 mb-8 overflow-x-auto pb-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
      >
        {categories.map(c => (
          <motion.button
            key={c.label}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-sm text-muted-foreground hover:text-foreground hover:bg-border whitespace-nowrap transition-colors"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
          >
            {c.emoji} {c.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={stagger.container} initial="hidden" animate="visible"
      >
        {requests.map(r => (
          <motion.div
            key={r.title}
            className="glass-card p-5 relative group"
            variants={stagger.item}
            whileHover={{ y: -4, borderColor: "hsla(357,100%,44.5%,0.25)" }}
          >
            <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-lg text-[10px] font-bold ${urgencyColors[r.urgency]}`}>
              {r.urgency === "critical" ? "🚨 Critical" : "Regular"}
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1 pr-20">{r.title}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <span>{r.ngo}</span> • <MapPin size={10} /> {r.location}
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{r.desc}</p>
            <div className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{r.progress}% collected</span>
                <span className="font-mono text-foreground">{r.qty}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] px-2 py-0.5 rounded-lg bg-accent text-accent-foreground">{r.category}</span>
              <motion.a
                href={r.donationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium inline-block"
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px hsla(357,100%,44.5%,0.3)" }}
                whileTap={{ scale: 0.97 }}
                data-cursor-hover
              >
                Donate Now →
              </motion.a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </DashboardLayout>
  );
};

export default Donations;
