import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface PulseUserMetrics {
  articlesRead: number;
  donations: number;
  volunteerHours: number;
}

export interface PulseUserProfile {
  name: string;
  location: string;
  metrics: PulseUserMetrics;
}

interface UserContextType {
  profile: PulseUserProfile;
  setProfile: (updater: PulseUserProfile | ((prev: PulseUserProfile) => PulseUserProfile)) => void;
  incrementArticlesRead: () => void;
}

const STORAGE_KEY = "pulsepoint-user-profile";

const DEFAULT_PROFILE: PulseUserProfile = {
  name: "Erron",
  location: "Philippines",
  metrics: {
    articlesRead: 0,
    donations: 3,
    volunteerHours: 12,
  },
};

const LEGACY_NAMES = new Set(["guest", "user", "there", "traveler", "volunteer"]);
const LEGACY_LOCATIONS = new Set(["india", "mumbai", "unknown", "earth"]);

const UserContext = createContext<UserContextType | undefined>(undefined);

const sanitizeName = (name?: string | null) => {
  const normalized = name?.trim();

  if (!normalized || LEGACY_NAMES.has(normalized.toLowerCase())) {
    return DEFAULT_PROFILE.name;
  }

  return normalized;
};

const sanitizeLocation = (location?: string | null) => {
  const normalized = location?.trim();

  if (!normalized || LEGACY_LOCATIONS.has(normalized.toLowerCase())) {
    return DEFAULT_PROFILE.location;
  }

  return normalized;
};

const sanitizeProfile = (profile?: Partial<PulseUserProfile> | null): PulseUserProfile => ({
  name: sanitizeName(profile?.name),
  location: sanitizeLocation(profile?.location),
  metrics: {
    articlesRead: profile?.metrics?.articlesRead ?? DEFAULT_PROFILE.metrics.articlesRead,
    donations: profile?.metrics?.donations ?? DEFAULT_PROFILE.metrics.donations,
    volunteerHours: profile?.metrics?.volunteerHours ?? DEFAULT_PROFILE.metrics.volunteerHours,
  },
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<PulseUserProfile>(() => {
    if (typeof window === "undefined") {
      return DEFAULT_PROFILE;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PROFILE;
    }

    try {
      const parsed = JSON.parse(stored) as Partial<PulseUserProfile>;
      return sanitizeProfile(parsed);
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setProfile: UserContextType["setProfile"] = (updater) => {
    setProfileState((prev) => {
      const nextValue = typeof updater === "function" ? updater(prev) : updater;
      return sanitizeProfile(nextValue);
    });
  };

  const incrementArticlesRead = () => {
    setProfileState((prev) =>
      sanitizeProfile({
        ...prev,
        metrics: {
          ...prev.metrics,
          articlesRead: prev.metrics.articlesRead + 1,
        },
      })
    );
  };

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      incrementArticlesRead,
    }),
    [profile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserProfile() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserProfile must be used within a UserProvider");
  }

  return context;
}