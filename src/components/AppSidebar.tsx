import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Map, Users, Gift, Package, BarChart3, Zap,
  BookOpen, Megaphone, Bot, Bell, Settings, ChevronLeft, LogOut,
} from "lucide-react";
import HeartLogo from "./HeartLogo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Map, label: "NGO Map", path: "/map" },
  { icon: Users, label: "NGO Matches", path: "/ngos" },
  { icon: Gift, label: "Donate", path: "/donations" },
  { icon: Package, label: "Tracking", path: "/tracking" },
  { icon: BarChart3, label: "My Impact", path: "/impact" },
  { icon: Zap, label: "Activity", path: "/activity" },
  { icon: BookOpen, label: "Library", path: "/library" },
  { icon: Megaphone, label: "Feed", path: "/feed" },
  { icon: Bot, label: "AI Advisor", path: "/advisor" },
];

const bottomItems = [
  { icon: Bell, label: "Alerts", path: "/notifications", badge: 3 },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const AppSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ item, badge }: { item: typeof navItems[0]; badge?: number }) => {
    const active = isActive(item.path);
    return (
      <Link to={item.path} data-cursor-hover>
        <motion.div
          className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group ${
            active
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
          whileHover={{ x: collapsed ? 0 : 4 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {active && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
              layoutId="activeNav"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <item.icon size={20} strokeWidth={1.5} className={active ? "text-primary" : ""} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="text-sm font-medium whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
          {badge && badge > 0 && (
            <motion.div
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {badge}
            </motion.div>
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-card border-r border-border z-40 flex flex-col"
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link to="/" data-cursor-hover>
          <HeartLogo size={28} collapsed={collapsed} />
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          data-cursor-hover
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft size={16} strokeWidth={1.5} className="text-muted-foreground" />
          </motion.div>
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-border" />

      {/* Bottom Items */}
      <div className="p-3 space-y-1">
        {bottomItems.map(item => (
          <NavItem key={item.path} item={item} badge={(item as any).badge} />
        ))}
        <div className="flex items-center justify-between pt-2">
          <ThemeToggle />
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {user?.avatarInitial ?? "?"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name ?? "Guest"}
                </p>
                <p className="text-[11px] text-muted-foreground">{user?.role ?? ""}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              className="p-1.5 rounded-lg hover:bg-secondary"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              data-cursor-hover
            >
              <LogOut size={14} strokeWidth={1.5} className="text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
