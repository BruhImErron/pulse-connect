import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Building2,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Circle,
  CalendarDays,
  Bell,
  ArrowRight,
  Loader2,
  MapPin,
  Sparkles,
  RadioTower,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DashboardLayout from "@/components/DashboardLayout";
import AnimatedCounter from "@/components/AnimatedCounter";
import { DecipherText } from "@/components/DecipherText";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const chartData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 72 },
  { month: "Mar", score: 68 },
  { month: "Apr", score: 78 },
  { month: "May", score: 85 },
  { month: "Jun", score: 91 },
];

const events = [
  { title: "Community outreach orientation", date: "This week", time: "Flexible" },
  { title: "Skills matching review", date: "After applying", time: "Online" },
  { title: "NGO discovery session", date: "Anytime", time: "Self-paced" },
];

const nextSteps = [
  { num: "01", task: "Complete profile verification", done: true },
  { num: "02", task: "Apply to 3 NGOs", done: true },
  { num: "03", task: "Log your first volunteer hours", done: false },
  { num: "04", task: "Share your first story", done: false },
];

const communityNodes = [
  { id: "triage", label: "Triage Hub", x: 10, y: 56, type: "hub", intensity: "high" },
  { id: "mobile", label: "Mobile Clinic", x: 26, y: 34, type: "route", intensity: "high" },
  { id: "barangay", label: "Barangay Teams", x: 32, y: 72, type: "community", intensity: "medium" },
  { id: "supplies", label: "Supply Chain", x: 50, y: 22, type: "route", intensity: "medium" },
  { id: "volunteers", label: "Volunteer Pool", x: 54, y: 56, type: "hub", intensity: "high" },
  { id: "telehealth", label: "Telehealth Desk", x: 50, y: 82, type: "community", intensity: "low" },
  { id: "coast", label: "Coastal Response", x: 74, y: 34, type: "route", intensity: "medium" },
  { id: "maternal", label: "Maternal Care", x: 74, y: 66, type: "community", intensity: "high" },
  { id: "field", label: "Field Units", x: 90, y: 52, type: "hub", intensity: "high" },
] as const;

const communityEdges = [
  { id: "e1", from: "triage", to: "mobile", flow: 84 },
  { id: "e2", from: "triage", to: "barangay", flow: 71 },
  { id: "e3", from: "mobile", to: "supplies", flow: 64 },
  { id: "e4", from: "barangay", to: "volunteers", flow: 76 },
  { id: "e5", from: "supplies", to: "volunteers", flow: 88 },
  { id: "e6", from: "volunteers", to: "telehealth", flow: 59 },
  { id: "e7", from: "volunteers", to: "coast", flow: 80 },
  { id: "e8", from: "volunteers", to: "maternal", flow: 92 },
  { id: "e9", from: "coast", to: "field", flow: 73 },
  { id: "e10", from: "maternal", to: "field", flow: 86 },
] as const;

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 15, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1 } },
};

const CommunityPulse = () => {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const nodeMap = useMemo(
    () =>
      Object.fromEntries(
        communityNodes.map((node) => [
          node.id,
          {
            ...node,
            radius: node.type === "hub" ? 8 : node.type === "route" ? 6.5 : 6,
          },
        ]),
      ),
    [],
  );

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-primary/20 bg-[linear-gradient(180deg,rgba(227,0,15,0.08),rgba(5,5,5,0.92))] p-5 shadow-[0_20px_80px_-50px_rgba(227,0,15,0.65)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(227,0,15,0.18),transparent_30%),radial-gradient(circle_at_80%_50%,rgba(227,0,15,0.12),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
      <div className="relative mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary/80">Community Pulse</p>
          <h3 className="mt-2 text-lg font-semibold text-foreground">Active aid routes across the network</h3>
          <p className="mt-1 max-w-xl text-xs text-muted-foreground">
            Hover any route to inspect the current intensity between hubs, volunteers, and care delivery points.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-background/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-primary/85">
          <RadioTower className="h-3.5 w-3.5" />
          Live routing
        </div>
      </div>

      <div className="relative h-[320px] rounded-[24px] border border-white/5 bg-black/25 p-2">
        <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[linear-gradient(rgba(227,0,15,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(227,0,15,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <svg viewBox="0 0 100 100" className="relative z-10 h-full w-full overflow-visible">
          <defs>
            <filter id="communityLineGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="communityNodeFill" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
              <stop offset="35%" stopColor="rgba(227,0,15,0.95)" />
              <stop offset="100%" stopColor="rgba(88,0,8,0.85)" />
            </radialGradient>
          </defs>

          {communityEdges.map((edge, index) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            const isHovered = hoveredEdge === edge.id;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const curveOffset = index % 2 === 0 ? -6 : 6;
            const path = `M ${from.x} ${from.y} Q ${midX} ${midY + curveOffset} ${to.x} ${to.y}`;

            return (
              <g key={edge.id}>
                <path
                  d={path}
                  fill="none"
                  stroke={isHovered ? "rgba(255, 82, 96, 0.95)" : "rgba(227, 0, 15, 0.24)"}
                  strokeWidth={isHovered ? 1.6 : 0.85}
                  filter="url(#communityLineGlow)"
                  strokeLinecap="round"
                  className="transition-all duration-200"
                />
                <motion.path
                  d={path}
                  fill="none"
                  stroke={isHovered ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 110, 120, 0.75)"}
                  strokeWidth={isHovered ? 0.75 : 0.45}
                  strokeLinecap="round"
                  strokeDasharray="2 7"
                  animate={{ strokeDashoffset: [0, -18] }}
                  transition={{ duration: 1.8 + index * 0.08, repeat: Infinity, ease: "linear" }}
                />
                <path
                  d={path}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={5}
                  onMouseEnter={() => setHoveredEdge(edge.id)}
                  onMouseLeave={() => setHoveredEdge((current) => (current === edge.id ? null : current))}
                />
              </g>
            );
          })}

          {communityNodes.map((node, index) => {
            const isConnectedToHovered =
              hoveredEdge != null &&
              communityEdges.some((edge) => edge.id === hoveredEdge && (edge.from === node.id || edge.to === node.id));

            return (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
                <motion.circle
                  r={nodeMap[node.id].radius + 3.5}
                  fill="rgba(227,0,15,0.12)"
                  animate={{
                    opacity: node.intensity === "high" ? [0.35, 0.9, 0.35] : [0.18, 0.45, 0.18],
                    scale: isConnectedToHovered ? [1, 1.25, 1] : [1, 1.12, 1],
                  }}
                  transition={{
                    duration: node.intensity === "high" ? 1.8 : 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.1,
                  }}
                />
                <motion.circle
                  r={nodeMap[node.id].radius}
                  fill="url(#communityNodeFill)"
                  stroke={isConnectedToHovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)"}
                  strokeWidth={isConnectedToHovered ? 0.65 : 0.35}
                  animate={{
                    filter: isConnectedToHovered
                      ? [
                          "drop-shadow(0 0 2px rgba(255,255,255,0.4)) drop-shadow(0 0 10px rgba(227,0,15,0.9))",
                          "drop-shadow(0 0 4px rgba(255,255,255,0.7)) drop-shadow(0 0 16px rgba(227,0,15,1))",
                          "drop-shadow(0 0 2px rgba(255,255,255,0.4)) drop-shadow(0 0 10px rgba(227,0,15,0.9))",
                        ]
                      : [
                          "drop-shadow(0 0 2px rgba(227,0,15,0.3))",
                          "drop-shadow(0 0 10px rgba(227,0,15,0.65))",
                          "drop-shadow(0 0 2px rgba(227,0,15,0.3))",
                        ],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.08,
                  }}
                />
                <text
                  x={0}
                  y={nodeMap[node.id].radius + 7}
                  textAnchor="middle"
                  className="fill-white/80 text-[3px] font-medium tracking-[0.18em]"
                >
                  {node.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 right-3 grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            { label: "Open routes", value: "10", note: "stabilized corridors" },
            { label: "Volunteer relays", value: "42", note: "active handoffs" },
            { label: "Care velocity", value: "88%", note: "response continuity" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-primary/15 bg-background/55 px-3 py-2 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-lg font-semibold text-foreground">{stat.value}</span>
                <span className="text-[11px] text-primary/80">{stat.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: impactData, isLoading: impactLoading } = useQuery({
    queryKey: ["impact"],
    queryFn: () => api.impact.get().then((res) => res.data),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.notifications.list().then((res) => res.data.notifications),
  });

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"pending" | "granted" | "denied" | "unavailable">("pending");

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus("unavailable");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoStatus("granted");
      },
      () => {
        setGeoStatus("denied");
        setUserCoords(null);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const { data: ngoMatchesData } = useQuery({
    queryKey: ["ngos", userCoords?.lat ?? null, userCoords?.lng ?? null, geoStatus],
    queryFn: () => api.ngos.list(userCoords?.lat, userCoords?.lng).then((res) => res.data.ngos),
    enabled: geoStatus !== "pending",
  });

  const impact = impactData || {
    hoursVolunteered: 0,
    ngosSupported: 0,
    carbonSaved: 0,
    xpPoints: 0,
    level: user?.level || 1,
    itemsDonated: 0,
    currentStreak: 0,
  };

  const kpis = [
    {
      icon: Clock,
      label: "Hours Logged",
      value: Math.round(impact.hoursVolunteered || 0),
      trend: 12,
      up: true,
    },
    {
      icon: Users,
      label: "NGOs Joined",
      value: impact.ngosSupported || 0,
      trend: 2,
      up: true,
    },
    {
      icon: Building2,
      label: "Level",
      value: impact.level || 1,
      trend: 1,
      up: true,
    },
    {
      icon: Zap,
      label: "XP Points",
      value: impact.xpPoints || user?.xpPoints || 0,
      trend: 3,
      up: true,
    },
  ];

  const notifList = notificationsData?.slice(0, 4) || [];
  const topMatch = useMemo(() => ngoMatchesData?.[0] ?? null, [ngoMatchesData]);

  const profileChecks = [
    { label: "Basic Info", done: Boolean(user?.name && user?.email) },
    { label: "Bio Added", done: Boolean(user?.bio) },
    { label: "Location Added", done: Boolean(user?.location || user?.country) },
    { label: "Verification", done: false },
  ];

  const completedChecks = profileChecks.filter((item) => item.done).length;
  const profileCompletion = Math.round((completedChecks / profileChecks.length) * 100);

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-heading font-bold text-foreground">
            <DecipherText text="Dashboard" />
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, {user?.name || "there"} — here's your latest impact snapshot.
          </p>
        </motion.div>

        <motion.button
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_14px_40px_hsla(357,100%,44.5%,0.25)]"
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px hsla(357,100%,44.5%,0.4)" }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          data-cursor-hover
          onClick={() => navigate("/ngos")}
        >
          Find Opportunities <ArrowRight size={16} strokeWidth={1.5} />
        </motion.button>
      </div>

      {impactLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          {kpis.map((kpi) => (
            <motion.div
              key={kpi.label}
              className="glass-card group p-5"
              variants={stagger.item}
              whileHover={{ y: -3, borderColor: "hsla(357,100%,44.5%,0.25)" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <kpi.icon size={20} strokeWidth={1.5} className="text-primary" />
                <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-success" : "text-destructive"}`}>
                  {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {kpi.trend}%
                </div>
              </div>
              <div className="font-mono text-3xl font-bold text-foreground">
                <AnimatedCounter value={kpi.value} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{kpi.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <CommunityPulse />
        </motion.div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <motion.div
          className="glass-card p-6 xl:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">NGO Match Analysis</h3>
              <p className="text-xs text-muted-foreground">How your fit score has improved over time</p>
            </div>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="h-[220px]">
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
                <Tooltip contentStyle={{ background: "#1A1A1A", border: "1px solid #222", borderRadius: 12, color: "#F5F5F5" }} />
                <Area type="monotone" dataKey="score" stroke="hsl(357,100%,44.5%)" fill="url(#scoreGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Top Match</h3>
            <button
              type="button"
              className="text-xs font-medium text-primary"
              onClick={() => navigate("/map")}
            >
              View map
            </button>
          </div>

          {topMatch ? (
            <>
              <div className="mb-4 text-center">
                <div className="relative mx-auto mb-3 h-20 w-20">
                  <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="hsl(357,100%,44.5%)"
                      strokeWidth="3"
                      strokeDasharray="100"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - (topMatch.matchScore ?? topMatch.score) }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold text-foreground">
                    {topMatch.matchScore ?? topMatch.score}
                  </span>
                </div>
                <p className="font-semibold text-foreground">{topMatch.name}</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {[topMatch.location, topMatch.country].filter(Boolean).join(", ")}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Proximity", value: topMatch.distance != null ? Math.max(35, 100 - Math.min(topMatch.distance, 65)) : 82 },
                  { label: "Cause Fit", value: Math.max(55, Math.round((topMatch.matchScore ?? topMatch.score) * 0.95)) },
                  { label: "Quality Score", value: topMatch.score },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{bar.label}</span>
                      <span className="font-mono text-foreground">{Math.round(bar.value)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(bar.value)}%` }}
                        transition={{ duration: 1, delay: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No NGO recommendations available yet.
            </div>
          )}
        </motion.div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Profile Completion</h3>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative h-16 w-16">
              <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="hsl(var(--success))"
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - profileCompletion }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-foreground">
                {profileCompletion}%
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {completedChecks} of {profileChecks.length} steps completed
            </div>
          </div>
          <div className="space-y-2">
            {profileChecks.map((item) => (
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

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Upcoming Opportunities</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <motion.div
                key={event.title}
                className="rounded-2xl border border-border/60 p-3 transition-colors hover:bg-secondary/70"
                whileHover={{ x: 3 }}
                data-cursor-hover
              >
                <div className="flex items-start gap-3">
                  <CalendarDays size={16} strokeWidth={1.5} className="mt-0.5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date} • {event.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">Recent Notifications</h3>
          <div className="space-y-3">
            {notifList.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notifications yet</p>
            ) : (
              notifList.map((notification) => (
                <motion.div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-xl p-2"
                  whileHover={{ x: 3 }}
                  data-cursor-hover
                >
                  <div className="relative">
                    <Bell size={14} strokeWidth={1.5} className="mt-0.5 text-muted-foreground" />
                    {!notification.read && <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{notification.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{notification.message ?? notification.body}</p>
                  </div>
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="mb-4 text-sm font-semibold text-foreground">Next Steps</h3>
        <div className="flex flex-wrap gap-4">
          {nextSteps.map((step, index) => (
            <motion.div
              key={step.num}
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <span className="font-mono text-xs text-primary">{step.num}</span>
              {step.done ? (
                <CheckCircle2 size={14} className="text-success" />
              ) : (
                <Circle size={14} className="text-muted-foreground" />
              )}
              <span className={`text-sm ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {step.task}
              </span>
              {index < nextSteps.length - 1 && <ArrowRight size={12} className="ml-2 text-muted-foreground" />}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;