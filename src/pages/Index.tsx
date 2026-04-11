import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Users, MapPin, Gift, BarChart3, Bot, Trophy, Globe, Map,
  Target, LogIn, Heart, ArrowRight, Play, ChevronDown,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import HeartLogo from "@/components/HeartLogo";
import AnimatedCounter from "@/components/AnimatedCounter";
import ThemeToggle from "@/components/ThemeToggle";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  },
};

const features = [
  { icon: Users, title: "Smart NGO Matching", desc: "AI-powered compatibility scoring" },
  { icon: MapPin, title: "Location Discovery", desc: "Find NGOs nearest to you" },
  { icon: Gift, title: "Donation Tracking", desc: "Track items from door to NGO" },
  { icon: BarChart3, title: "Impact Dashboard", desc: "Visualize your contribution" },
  { icon: Bot, title: "AI Health Advisor", desc: "Personalized health guidance" },
  { icon: Trophy, title: "Badges & Achievements", desc: "Level up your volunteer journey" },
];

const stats = [
  { icon: Globe, value: 50, suffix: "+", label: "NGOs Partnered" },
  { icon: Map, value: 12, label: "Countries" },
  { icon: Users, value: 2400, suffix: "+", label: "Volunteers" },
  { icon: Target, value: 98, suffix: "%", label: "Match Rate" },
];

const steps = [
  { icon: LogIn, num: "01", title: "Create Profile", desc: "Sign up and set your health interests" },
  { icon: Target, num: "02", title: "Get Matched", desc: "Our AI finds the perfect NGO fit" },
  { icon: Heart, num: "03", title: "Make Impact", desc: "Volunteer, donate, and change lives" },
];

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background grain-overlay scanlines">
      {/* Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <HeartLogo size={28} />
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
              Dashboard
            </Link>
            <Link to="/ngos" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
              NGOs
            </Link>
            <Link to="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
              Feed
            </Link>
            <ThemeToggle />
            <Link to="/dashboard" data-cursor-hover>
              <motion.button
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsla(357,100%,44.5%,0.4)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <ParticleBackground variant="hero" particleCount={100} />
        {/* Radial glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/80 backdrop-blur-sm mb-8"
              animate={{ boxShadow: ["0 0 0px hsla(357,100%,44.5%,0)", "0 0 20px hsla(357,100%,44.5%,0.2)", "0 0 0px hsla(357,100%,44.5%,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-sm">🌍</span>
              <span className="text-xs font-medium text-muted-foreground">SDG 3 Mission</span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <span className="text-foreground">Your Health Impact</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
              Starts Here.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Connect with health NGOs. Volunteer. Donate. Track your impact.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/dashboard" data-cursor-hover>
              <motion.button
                className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base flex items-center gap-2"
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px hsla(357,100%,44.5%,0.4)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started <ArrowRight size={18} strokeWidth={1.5} />
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-3.5 rounded-2xl border border-primary/40 text-primary font-medium text-base flex items-center gap-2 hover:bg-primary/5 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              data-cursor-hover
            >
              <Play size={16} strokeWidth={1.5} /> Watch Demo
            </motion.button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex -space-x-2">
              {["A", "B", "C"].map((l, i) => (
                <div key={l} className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {l}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">2,400+ volunteers active</span>
          </motion.div>

          {/* Floating stat cards */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-6 pointer-events-none">
            {[
              { icon: Globe, label: "50+ NGOs" },
              { icon: Map, label: "12 Countries" },
              { icon: Users, label: "2.4k Students" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="glass-card px-5 py-3 flex items-center gap-2 pointer-events-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                <s.icon size={16} strokeWidth={1.5} className="text-primary" />
                <span className="text-sm font-medium text-foreground">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} strokeWidth={1.5} className="text-muted-foreground" />
        </motion.div>
      </motion.section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 grid-overlay pointer-events-none opacity-50" />
        <div className="relative z-10">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-micro text-primary mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-primary inline-block" />
              WHAT YOU CAN DO
            </p>
            <h2 className="text-3xl font-heading font-bold text-foreground">
              Everything you need to make an impact
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                className="glass-card p-6 group"
                variants={stagger.item}
                whileHover={{ y: -6, borderColor: "hsla(357,100%,44.5%,0.25)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4"
                  whileHover={{ boxShadow: "0 0 20px hsla(357,100%,44.5%,0.3)" }}
                >
                  <f.icon size={24} strokeWidth={1.5} className="text-primary" />
                </motion.div>
                <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <s.icon size={20} strokeWidth={1.5} className="text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter value={s.value} suffix={s.suffix} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-micro text-primary mb-3">HOW IT WORKS</p>
          <h2 className="text-3xl font-heading font-bold text-foreground">Three simple steps</h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px border-t-2 border-dashed border-primary/30" />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="relative text-center flex flex-col items-center z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, borderColor: "hsl(357,100%,44.5%)" }}
              >
                <s.icon size={24} strokeWidth={1.5} className="text-primary" />
              </motion.div>
              <span className="font-mono text-xs text-primary mb-2">{s.num}</span>
              <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[200px]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <HeartLogo size={24} />
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
              Dashboard
            </Link>
            <Link to="/ngos" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
              NGOs
            </Link>
            <Link to="/feed" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor-hover>
              Feed
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">Built for SDG 3</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
