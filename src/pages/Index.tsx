import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import {
  Users,
  MapPin,
  Gift,
  BarChart3,
  Bot,
  Trophy,
  Globe,
  Map,
  Target,
  LogIn,
  Heart,
  ArrowRight,
  Sparkles,
  BookOpen,
  HandHeart,
  ChevronDown,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import HeartLogo from "@/components/HeartLogo";
import HeartbeatMonitor from "@/components/HeartbeatMonitor";
import AnimatedCounter from "@/components/AnimatedCounter";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

const features = [
  { icon: Users, title: "Smart NGO Matching", desc: "Discover organizations aligned with your skills, location, and causes you care about." },
  { icon: MapPin, title: "Live Opportunity Discovery", desc: "Browse nearby nonprofits and social-impact partners using real geolocation-aware matching." },
  { icon: Gift, title: "Donation Pathways", desc: "Support vetted NGOs directly through trusted external donation links and campaigns." },
  { icon: BarChart3, title: "Impact Dashboard", desc: "Track your volunteering, donations, and progress in one personal impact hub." },
  { icon: Bot, title: "AI Health Advisor", desc: "Access practical health guidance and supportive prompts tailored to your journey." },
  { icon: Trophy, title: "Achievements & Growth", desc: "Build momentum with milestones, points, and meaningful community recognition." },
];

const stats = [
  { icon: Globe, value: 50, suffix: "+", label: "Curated NGOs" },
  { icon: Map, value: 12, label: "Countries represented" },
  { icon: Users, value: 2400, suffix: "+", label: "Volunteers engaged" },
  { icon: Target, value: 98, suffix: "%", label: "Relevant match confidence" },
];

const steps = [
  { icon: LogIn, num: "01", title: "Create your profile", desc: "Set your interests, location, and the impact areas you want to support." },
  { icon: Target, num: "02", title: "Explore the best matches", desc: "See organizations, causes, and donation paths ranked for your context." },
  { icon: Heart, num: "03", title: "Take action that matters", desc: "Volunteer, donate, learn, and keep building measurable community impact." },
];

const spotlightCards = [
  { icon: HandHeart, label: "Volunteer with trusted NGOs" },
  { icon: BookOpen, label: "Read practical social-impact guides" },
  { icon: Sparkles, label: "Turn intent into visible outcomes" },
];

const Landing = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.965]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const handleEmergencyMode = (active: boolean) => {
    setEmergencyMode(active);
    // Apply emergency theme to entire page
    document.documentElement.style.setProperty('--emergency-bg', active ? '#1f2937' : '');
    document.documentElement.style.setProperty('--emergency-text', active ? '#fbbf24' : '');
  };

  return (
    <div className="min-h-screen bg-background grain-overlay scanlines">
      {/* ECG Dashboard - Fixed top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-red-500/20 bg-gradient-to-b from-background via-background to-transparent pt-16 pb-4">
        <HeartbeatMonitor className="z-0" onEmergencyMode={handleEmergencyMode} />
      </div>

      <motion.nav
        className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <HeartLogo size={28} />
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              Dashboard
            </Link>
            <Link to="/ngos" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              NGOs
            </Link>
            <Link to="/library" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              Library
            </Link>
            <Link to="/donations" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              Donations
            </Link>
            <ThemeToggle />
            <Button asChild className="rounded-xl px-5">
              <Link to="/dashboard" data-cursor-hover>
                Get Started
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/dashboard">Open App</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      <motion.section
        className="relative flex min-h-screen items-center justify-center overflow-hidden pt-32"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <ParticleBackground variant="hero" particleCount={240} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(357,100%,44.5%,0.18),transparent_45%),radial-gradient(circle_at_bottom,hsla(357,100%,44.5%,0.12),transparent_50%),linear-gradient(to_bottom,transparent,hsla(var(--background),0.95))]" />
        <div className="pointer-events-none absolute left-1/2 top-[18%] h-72 w-72 -translate-x-1/2 rounded-full bg-primary/12 blur-[140px] animate-pulse" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-[900px] -translate-x-1/2 rounded-full bg-primary/12 blur-[160px] animate-pulse" />
        <div className="pointer-events-none absolute top-1/4 right-1/4 h-48 w-48 rounded-full bg-accent/8 blur-[100px] animate-bounce" />
        <div className="pointer-events-none absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/6 blur-[120px] animate-pulse" />
        
        {/* Floating geometric shapes */}
        <motion.div
          className="pointer-events-none absolute top-20 left-20 h-4 w-4 rounded-full bg-primary/40"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="pointer-events-none absolute top-40 right-32 h-6 w-6 rounded-lg bg-accent/30"
          animate={{
            y: [0, 30, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-32 left-16 h-3 w-3 rounded-full bg-primary/50"
          animate={{
            x: [0, 40, 0],
            y: [0, -25, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-16 px-4 pt-28 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 backdrop-blur-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Purpose-built for SDG 3 and community action</span>
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl font-heading font-bold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Health impact,
              <br />
              <span className="bg-gradient-to-r from-primary via-destructive to-primary bg-clip-text text-transparent">
                mapped to action.
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Pulse Connect helps people discover meaningful NGOs, support real causes, learn through curated articles,
              and contribute with clarity instead of guesswork.
            </motion.p>

            <motion.div
              className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <Button asChild size="lg" className="w-full rounded-2xl px-8 sm:w-auto">
                <Link to="/dashboard" data-cursor-hover>
                  Explore your dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full rounded-2xl border-primary/30 bg-background/60 sm:w-auto">
                <Link to="/library" data-cursor-hover>
                  Browse the library
                </Link>
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {spotlightCards.map((card, index) => (
                <motion.div
                  key={card.label}
                  className="glass-card flex items-center gap-2 px-4 py-2.5 text-sm text-foreground"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                >
                  <card.icon className="h-4 w-4 text-primary" />
                  <span>{card.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative w-full max-w-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.75 }}
          >
            <div className="glass-card relative overflow-hidden rounded-[28px] border border-primary/15 p-6 sm:p-7">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-primary/80">Impact overview</p>
                  <h2 className="mt-2 text-2xl font-semibold text-foreground">Find where your effort fits best</h2>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <Target className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Nearby NGO matching",
                    body: "See organizations ranked by cause alignment, country context, and proximity.",
                    icon: MapPin,
                  },
                  {
                    title: "Donation-ready organizations",
                    body: "Open secure external donation links only when a real NGO destination is available.",
                    icon: Gift,
                  },
                  {
                    title: "Learning that supports action",
                    body: "Explore practical articles on health, resilience, volunteering, and social impact.",
                    icon: BookOpen,
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="rounded-xl bg-primary/10 p-2">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { label: "NGO partners", value: "50+" },
                  { label: "Learning articles", value: "50" },
                  { label: "Volunteer-ready", value: "24/7" },
                  { label: "Action paths", value: "Real-time" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/60 bg-card/80 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-xl font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-7 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} strokeWidth={1.5} className="text-muted-foreground" />
        </motion.div>
      </motion.section>

      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-45" />
        <div className="relative z-10">
          <motion.div
            className="mb-12 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="mb-3 flex items-center gap-2 text-micro text-primary">
              <span className="inline-block h-px w-8 bg-primary" />
              WHAT YOU CAN DO
            </p>
            <h2 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">
              One place to discover, give, learn, and grow
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Designed to reduce friction between intention and impact with clearer navigation, richer NGO discovery,
              and practical social-good learning tools.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            variants={stagger.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="glass-card group rounded-[24px] p-6"
                variants={stagger.item}
                whileHover={{ y: -6, borderColor: "hsla(357,100%,44.5%,0.25)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent"
                  whileHover={{ boxShadow: "0 0 20px hsla(357,100%,44.5%,0.3)" }}
                >
                  <feature.icon size={24} strokeWidth={1.5} className="text-primary" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card/70 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <stat.icon size={20} strokeWidth={1.5} className="mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold text-foreground">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="mb-3 text-micro text-primary">HOW IT WORKS</p>
          <h2 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">Three simple steps to start contributing</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Whether you are here to volunteer, donate, or simply learn, the experience is structured to help you move with confidence.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center justify-between gap-12 md:flex-row">
          <div className="absolute left-[15%] right-[15%] top-1/2 hidden h-px border-t-2 border-dashed border-primary/30 md:block" />
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              className="relative z-10 flex max-w-[240px] flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <motion.div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card"
                whileHover={{ scale: 1.08, borderColor: "hsl(357,100%,44.5%)" }}
              >
                <step.icon size={24} strokeWidth={1.5} className="text-primary" />
              </motion.div>
              <span className="mb-2 font-mono text-xs text-primary">{step.num}</span>
              <h3 className="mb-2 text-lg font-heading font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <motion.div
          className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-primary/15 bg-card/70 p-8 shadow-[0_20px_80px_-40px_rgba(227,0,15,0.45)] backdrop-blur md:p-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="mb-3 text-micro text-primary">START NOW</p>
              <h2 className="text-3xl font-heading font-bold text-foreground sm:text-4xl">Bring your time, skills, or support to a cause that needs it.</h2>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Pulse Connect is built to help people act on care with less noise: better NGO discovery, a richer learning library,
                and direct donation routes to organizations doing real work.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="rounded-2xl">
                <Link to="/ngos">Find NGO matches</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-2xl border-primary/30 bg-background/50">
                <Link to="/donations">Support donation-ready NGOs</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-primary/20 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <HeartLogo size={24} />
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              Dashboard
            </Link>
            <Link to="/ngos" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              NGOs
            </Link>
            <Link to="/library" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              Library
            </Link>
            <Link to="/donations" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-cursor-hover>
              Donations
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">Built for SDG 3 and grassroots action</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;