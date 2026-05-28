import { useState, useEffect, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Camera, Save, MapPin, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BiometricWireframe } from "@/components/BiometricWireframe";

const tabs = ["Profile", "Notifications", "Privacy", "Appearance"];
const interests = ["Primary Care", "Mental Health", "Nutrition", "Hygiene", "Education", "Emergency", "Research", "Community"];

const SettingsPage = () => {
  const { user: authUser, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");
  const { theme, toggle } = useTheme();
  const queryClient = useQueryClient();
  
  // Form state
  type ProfileUpdatePayload = {
    name?: string;
    bio?: string;
    location?: string;
    country?: string;
    interests?: string[];
    avatarUrl?: string;
  };

  const [profileData, setProfileData] = useState<ProfileUpdatePayload>({
    name: "",
    bio: "",
    location: "",
    country: "",
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const [toggles, setToggles] = useState({
    push: true, email: false, donation: true, followers: true, achievements: true,
  });

  // Fetch user profile data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => api.auth.me().then((res) => res.data.user),
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileUpdatePayload) => api.auth.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      refreshUser();
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error("Failed to update profile: " + (error?.message || "Please try again."));
    },
  });

  // Initialize form data when user data loads
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || "",
        bio: userData.bio || "",
        location: userData.location || "",
        country: userData.country || "",
      });
      setSelectedInterests(userData.interests || []);
      setProfileImage(userData.avatarUrl || null);
    }
  }, [userData]);

  // Geolocation function
  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by this browser");
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        });
      });

      // Use a reverse geocoding service to get city/country
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );
      const data = await response.json();

      setProfileData(prev => ({
        ...prev,
        location: data.city || data.locality || "",
        country: data.countryName || "",
      }));

      toast.success("Location detected successfully!");
    } catch (error) {
      console.error("Geolocation error:", error);
      toast.error("Failed to get your location. Please check your browser permissions.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  // Handle profile image upload
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile image must be smaller than 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setProfileImage(imageData);
      updateProfileMutation.mutate({ avatarUrl: imageData });
    };
    reader.readAsDataURL(file);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    updateProfileMutation.mutate({
      ...profileData,
      interests: selectedInterests,
    });
  };

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
            {userLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        profileData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" data-cursor-hover>
                      <label htmlFor="profile-image" className="cursor-pointer">
                        <Camera size={20} className="text-foreground" />
                      </label>
                      <input
                        id="profile-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{profileData.name || "Your Name"}</h3>
                    <p className="text-sm text-muted-foreground">Volunteer • Level {authUser?.level || 1}</p>
                  </div>
                </div>

                {/* Biometric Wireframe */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h4 className="text-sm font-medium text-foreground mb-4">Biometric Profile</h4>
                  <BiometricWireframe
                    activityData={{
                      heartRate: 72,
                      steps: 8432,
                      calories: 2340,
                      activeMinutes: 45
                    }}
                  />
                </div>

                <div className="space-y-4">
                  {[
                    { 
                      label: "Full Name", 
                      value: profileData.name, 
                      key: "name" as keyof typeof profileData,
                      placeholder: "Enter your full name"
                    },
                    { 
                      label: "Bio", 
                      value: profileData.bio, 
                      key: "bio" as keyof typeof profileData,
                      placeholder: "Tell us about yourself"
                    },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-xs text-muted-foreground mb-1 block">{f.label}</label>
                      <input 
                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors" 
                        value={f.value}
                        placeholder={f.placeholder}
                        onChange={(e) => setProfileData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Location</label>
                    <div className="flex gap-2">
                      <input 
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors" 
                        value={profileData.location}
                        placeholder="City"
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      />
                      <input 
                        className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none transition-colors" 
                        value={profileData.country}
                        placeholder="Country"
                        onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                      />
                      <motion.button
                        className="px-3 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center"
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        data-cursor-hover
                      >
                        {isGettingLocation ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <MapPin size={16} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest) => (
                      <motion.button key={interest}
                        className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                          selectedInterests.includes(interest)
                            ? "border-primary text-primary bg-primary/10"
                            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                        onClick={() => setSelectedInterests(prev =>
                          prev.includes(interest)
                            ? prev.filter(i => i !== interest)
                            : [...prev, interest]
                        )}
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.97 }} 
                        data-cursor-hover
                      >{interest}</motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: updateProfileMutation.isPending ? 1 : 1.02, boxShadow: "0 0 25px hsla(357,100%,44.5%,0.3)" }}
                  whileTap={{ scale: 0.97 }} 
                  data-cursor-hover
                  onClick={handleSaveChanges}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </motion.button>
              </>
            )}
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
