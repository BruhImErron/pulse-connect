/**
 * api.ts - Type-safe API client library
 * Purpose: Centralized API communication layer between frontend and backend
 * Key Features:
 *   - Automatic JWT token management from localStorage
 *   - Type-safe request/response handling
 *   - Organized endpoints by feature (auth, posts, ngos, etc.)
 *   - Error handling with descriptive messages
 *   - Query parameter building for geolocation
 */

// ===== CONFIGURATION =====
const BASE_URL = "http://localhost:3002/api";

// ===== UTILITY FUNCTIONS =====
function getToken(): string | null {
  return localStorage.getItem("pp_token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  return data;
}

export const api = {
  auth: {
    register: (body: { email: string; password: string; name: string }) =>
      request<{ success: true; data: { user: User; token: string } }>(
        "/auth/register",
        { method: "POST", body: JSON.stringify(body) }
      ),

    login: (body: { email: string; password: string }) =>
      request<{ success: true; data: { user: User; token: string } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify(body) }
      ),

    me: () =>
      request<{ success: true; data: { user: User } }>("/auth/me"),

    updateProfile: (body: { name?: string; location?: string; country?: string; bio?: string; interests?: string[]; avatarUrl?: string }) =>
      request<{ success: true; data: { user: User } }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },

  posts: {
    list: () =>
      request<{ success: true; data: { posts: Post[] } }>("/posts"),

    create: (content: string) =>
      request<{ success: true; data: { post: Post } }>("/posts", {
        method: "POST",
        body: JSON.stringify({ content }),
      }),

    like: (postId: string) =>
      request<{ success: true; data: { liked: boolean } }>(
        `/posts/${postId}/like`,
        { method: "POST" }
      ),
  },

  ngos: {
    list: (options?: { lat?: number; lon?: number; page?: number; limit?: number; search?: string }) => {
      const params = new URLSearchParams();
      if (options?.lat !== undefined) params.append("lat", options.lat.toString());
      if (options?.lon !== undefined) params.append("lon", options.lon.toString());
      if (options?.page !== undefined) params.append("page", options.page.toString());
      if (options?.limit !== undefined) params.append("limit", options.limit.toString());
      if (options?.search !== undefined && options.search.trim()) params.append("search", options.search.trim());
      const queryStr = params.toString();

      return request<{ success: true; data: { ngos: Ngo[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean } } }>(
        `/ngos${queryStr ? `?${queryStr}` : ""}`
      );
    },

    apply: (ngoId: string, role: string) =>
      request<{ success: true; data: { application: unknown } }>(
        `/ngos/${ngoId}/apply`,
        { method: "POST", body: JSON.stringify({ role }) }
      ),
  },

  notifications: {
    list: () =>
      request<{ success: true; data: { notifications: Notification[] } }>(
        "/notifications"
      ),

    markRead: (id: string) =>
      request(`/notifications/${id}/read`, { method: "PATCH" }),

    markAllRead: () =>
      request("/notifications/read-all", { method: "PATCH" }),
  },

  activity: {
    list: () =>
      request<{ success: true; data: { activities: Activity[]; stats: ActivityStats } }>(
        "/activity"
      ),
  },

  advisor: {
    ask: (message: string) =>
      request<{ success: true; data: { reply: string } }>("/advisor", {
        method: "POST",
        body: JSON.stringify({ message }),
      }),
  },

  impact: {
    get: () =>
      request<{
        success: true;
        data: {
          itemsDonated: number;
          hoursVolunteered: number;
          ngosSupported: number;
          xpPoints: number;
          level: number;
          carbonSaved: number;
          currentStreak: number;
        };
      }>("/impact"),
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  level: number;
  avatarInitial: string;
  xpPoints?: number;
  bio?: string;
  location?: string;
  country?: string;
  avatarUrl?: string;
  interests?: string[];
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; role: string; avatarInitial: string };
  _count: { likes: number };
}

export interface Ngo {
  id: string;
  name: string;
  location: string;
  country?: string;
  description?: string;
  score: number;
  tags: string[];
  latitude: number;
  longitude: number;
  donationUrl?: string;
  distance?: number | null;
  matchScore?: number;
  isApplied?: boolean;
  _count?: {
    applications: number;
    volunteerHours: number;
  };
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  body?: string;
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: "volunteer" | "donation" | "application" | "post" | "like";
  title: string;
  description: string;
  time: string;
  hours: number | null;
  ngo: string | null;
}

export interface ActivityStats {
  thisWeek: number;
  thisMonth: number;
  total: number;
}