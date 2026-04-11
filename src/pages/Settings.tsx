import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Camera, Save } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/hooks/useTheme";

const tabs = ["Profile", "Notifications", "Privacy", "Appearance"];
const interests = ["Primary Care", "Mental Health", "Nutrition", "Hygiene", "Education", "Emergency", "Research", "Community"];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const { theme, toggle } = useTheme();
  const [toggles, setToggles] = useState({
    push: true, email: false, donation: true, followers: true, achievements: true,
  });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <motion.button
      className={`w-11 h-6 rounded-full p-0.5 transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}
      onClick={onChange} data-cursor-hover
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-primary-foreground"
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

  return (
    <DashboardLayout>
      <motion.div className="max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-secondary rounded-2xl p-1">
          {tabs.map(t => (
            <motion.button key={t}
              className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === t ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setActiveTab(t)}
              whileTap={{ scale: 0.97 }} data-cursor-hover
            >{t}</motion.button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "Profile" && (
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">A</div>
                <div className="absolute inset-0 rounded-2xl bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" data-cursor-hover>
                  <Camera size={20} className="text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Alex Chen</h3>
                <p className="text-sm text-muted-foreground">Volunteer • Level 5</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Full Name", value: "Alex Chen" },
                { label: "Bio", value: "Health volunteer passionate about community impact" },
                { label: "Location", value: "Mumbai, India" },
                { label: "Weekly Hours", value: "15" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                  <input className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors" defaultValue={f.value} />
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Interests</label>
              <div className="flex flex-wrap gap-2">
                {interests.map((t, i) => (
                  <motion.button key={t}
                    className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${i < 4 ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/40"}`}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} data-cursor-hover
                  >{t}</motion.button>
                ))}
              </div>
            </div>

            <motion.button
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2"
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px hsla(357,100%,44.5%,0.3)" }}
              whileTap={{ scale: 0.97 }} data-cursor-hover
            >
              <Save size={16} /> Save Changes
            </motion.button>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "Notifications" && (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[
              { key: "push", icon: Bell, label: "Push Notifications" },
              { key: "email", icon: Bell, label: "Email Digest" },
              { key: "donation", icon: Bell, label: "Donation Updates" },
              { key: "followers", icon: Bell, label: "New Followers" },
              { key: "achievements", icon: Bell, label: "Achievement Alerts" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 glass-card">
                <div className="flex items-center gap-3">
                  <item.icon size={16} strokeWidth={1.5} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <Toggle
                  checked={toggles[item.key as keyof typeof toggles]}
                  onChange={() => setToggles(t => ({ ...t, [item.key]: !t[item.key as keyof typeof toggles] }))}
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Appearance Tab */}
        {activeTab === "Appearance" && (
          <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Theme</h3>
              <div className="flex gap-3">
                {(["dark", "light"] as const).map(t => (
                  <motion.button key={t}
                    className={`flex-1 p-4 rounded-xl border text-center text-sm font-medium capitalize transition-colors ${
                      theme === t ? "border-primary text-primary" : "border-border text-muted-foreground"
                    }`}
                    onClick={theme !== t ? toggle : undefined}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} data-cursor-hover
                  >{t} Mode</motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Privacy Tab */}
        {activeTab === "Privacy" && (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="glass-card p-5">
              <Shield size={20} className="text-primary mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">Your data is safe</h3>
              <p className="text-sm text-muted-foreground">We never share your personal information with third parties. All data is encrypted at rest and in transit.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default SettingsPage;
