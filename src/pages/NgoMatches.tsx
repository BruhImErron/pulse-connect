import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  MapPin,
  Brain,
  Search,
  Star,
  Loader2,
  CheckCircle,
  LocateFixed,
  Compass,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { api, type Ngo } from "@/lib/api";

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

const FILTERS = ["All", "Primary Care", "Mental Health", "Nutrition", "Hygiene"];

const DEFAULT_LOCATION_MESSAGE = "Using global NGO ranking. Enable location for nearby matches.";

const NgoMatches = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoState, setGeoState] = useState<"idle" | "locating" | "granted" | "denied">("idle");
  const [geoMessage, setGeoMessage] = useState(DEFAULT_LOCATION_MESSAGE);
  const [pendingNgoId, setPendingNgoId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page when search changes
      if (search && activeFilter !== "All") {
        setActiveFilter("All"); // Reset filter when searching
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoState("denied");
      setGeoMessage("Geolocation is unavailable in this browser. Showing global NGO ranking.");
      return;
    }

    setGeoState("locating");
    setGeoMessage("Getting your location for better NGO recommendations...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGeoState("granted");
        setGeoMessage("Showing NGOs ranked using your current location.");
      },
      () => {
        setGeoState("denied");
        setGeoMessage("Location access denied. Showing global NGO ranking instead.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const ngosQueryKey = ["ngos", userCoords?.lat ?? null, userCoords?.lng ?? null, currentPage, debouncedSearch];

  const { data, isLoading, isError } = useQuery({
    queryKey: ngosQueryKey,
    queryFn: () => api.ngos.list({
      lat: userCoords?.lat,
      lon: userCoords?.lng,
      page: currentPage,
      limit: 20, // Show 20 NGOs per page
      search: debouncedSearch
    }),
  });

  const ngos = data?.data.ngos ?? [];
  const pagination = data?.data.pagination;

  const availableFilters = useMemo(() => {
    const dynamicFilters = Array.from(new Set(ngos.flatMap((ngo) => ngo.tags))).slice(0, 6);
    const merged = ["All", ...FILTERS.filter((filter) => filter !== "All"), ...dynamicFilters];
    return Array.from(new Set(merged));
  }, [ngos]);

  const filteredNgos = useMemo(() => {
    return ngos.filter((ngo) => {
      const matchesFilter =
        activeFilter === "All" ||
        ngo.tags.some((tag) => tag.toLowerCase() === activeFilter.toLowerCase());

      return matchesFilter;
    });
  }, [activeFilter, ngos]);

  const applyMutation = useMutation({
    mutationFn: ({ ngoId, role }: { ngoId: string; role: string }) =>
      api.ngos.apply(ngoId, role),
    onMutate: async ({ ngoId }) => {
      setPendingNgoId(ngoId);
      await queryClient.cancelQueries({ queryKey: ngosQueryKey });

      const previousData = queryClient.getQueryData<typeof data>(ngosQueryKey);

      queryClient.setQueryData(ngosQueryKey, (oldValue: typeof data) => {
        if (!oldValue?.data?.ngos) return oldValue;

        return {
          ...oldValue,
          data: {
            ...oldValue.data,
            ngos: oldValue.data.ngos.map((ngo) =>
              ngo.id === ngoId ? { ...ngo, isApplied: true } : ngo
            ),
          },
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      toast.success("Application submitted successfully");
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(ngosQueryKey, context.previousData);
      }
      toast.error(error.message || "Failed to submit application");
    },
    onSettled: () => {
      setPendingNgoId(null);
      queryClient.invalidateQueries({ queryKey: ["ngos"] });
    },
  });

  const handleApply = (ngoId: string, role: string) => {
    if (applyMutation.isPending) return;
    applyMutation.mutate({ ngoId, role });
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <Brain size={24} strokeWidth={1.5} className="text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Your NGO Matches
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Live opportunities ranked by score, proximity, and your current location.
        </p>
      </motion.div>

      <motion.div
        className="mb-6 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              {geoState === "locating" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : geoState === "granted" ? (
                <LocateFixed className="h-4 w-4" />
              ) : (
                <Compass className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Location-based matching</p>
              <p className="text-xs text-muted-foreground">{geoMessage}</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {userCoords ? `Lat ${userCoords.lat.toFixed(2)}, Lng ${userCoords.lng.toFixed(2)}` : "No precise coordinates"}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="mb-8 flex flex-col gap-3 xl:flex-row xl:items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative w-full xl:max-w-md">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            className="w-full rounded-2xl border border-border bg-input py-3 pl-10 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none"
            placeholder="Search NGOs, locations, or causes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {availableFilters.map((tag) => (
            <button
              key={tag}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                tag === activeFilter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
              data-cursor-hover
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="glass-card flex min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-center">
          <Users className="h-10 w-10 text-destructive" />
          <h2 className="text-lg font-semibold text-foreground">
            Unable to load NGO matches
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            The NGO matching service could not be reached. Refresh the page and
            try again.
          </p>
        </div>
      ) : filteredNgos.length === 0 ? (
        <div className="glass-card flex min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-center">
          <CheckCircle className="h-10 w-10 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            No NGO matches found
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Try a different search term or filter to see more organizations.
          </p>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 2xl:grid-cols-2"
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          {filteredNgos.map((ngo: Ngo, index) => {
            const scoreValue = ngo.matchScore ?? ngo.score;
            const isApplying = pendingNgoId === ngo.id && applyMutation.isPending;

            return (
              <div
                key={ngo.id}
                className="glass-card group relative overflow-hidden p-6 transition-transform duration-200 hover:-translate-y-1"
              >
                {index === 0 && (
                  <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-primary-foreground">
                    <Star size={10} /> Best Match
                  </div>
                )}

                <div className={`mb-4 flex items-start justify-between gap-4 ${index === 0 ? "pt-8" : ""}`}>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">
                      {ngo.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} strokeWidth={1.5} /> {ngo.location}
                      </span>
                      {ngo.country && <span>• {ngo.country}</span>}
                      {ngo.distance != null && (
                        <span>• {ngo.distance.toFixed(1)} km away</span>
                      )}
                    </div>
                  </div>

                  <div className="relative h-14 w-14 shrink-0">
                    <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke={
                          scoreValue >= 85
                            ? "hsl(var(--success))"
                            : scoreValue >= 70
                              ? "hsl(var(--warning))"
                              : "hsl(var(--destructive))"
                        }
                        strokeWidth="2.5"
                        strokeDasharray="100"
                        strokeDashoffset={100 - scoreValue}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      className={`absolute inset-0 flex items-center justify-center font-mono text-sm font-bold ${
                        scoreValue >= 85
                          ? "text-green-600"
                          : scoreValue >= 70
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {Math.round(scoreValue)}
                    </span>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {ngo.description || "No description available yet."}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {ngo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/40 p-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Match score</p>
                    <p className="mt-1 font-semibold text-foreground">{Math.round(scoreValue)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Applications</p>
                    <p className="mt-1 font-semibold text-foreground">{ngo._count?.applications ?? 0}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition duration-150 disabled:cursor-not-allowed ${
                      ngo.isApplied
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-primary text-primary-foreground disabled:opacity-70"
                    }`}
                    onClick={() => handleApply(ngo.id, "Volunteer")}
                    disabled={ngo.isApplied || applyMutation.isPending}
                    data-cursor-hover
                  >
                    {ngo.isApplied ? (
                      <span className="inline-flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Applied
                      </span>
                    ) : isApplying ? (
                      <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                    ) : (
                      "Apply to Volunteer"
                    )}
                  </button>

                  {ngo.donationUrl ? (
                    <a
                      href={ngo.donationUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition duration-150 hover:bg-secondary"
                      data-cursor-hover
                    >
                      Support <ExternalLink size={14} strokeWidth={1.5} />
                    </a>
                  ) : (
                    <button
                      className="rounded-xl border border-border bg-card p-2.5 text-foreground transition duration-150 hover:bg-secondary"
                      data-cursor-hover
                      type="button"
                    >
                      <Brain size={16} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <motion.div
          className="mt-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrev || isLoading}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
              if (pageNum > pagination.totalPages) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  disabled={isLoading}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pageNum === currentPage
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-secondary"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={!pagination.hasNext || isLoading}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Results summary */}
      {pagination && (
        <motion.div
          className="mt-4 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Showing {filteredNgos.length} of {pagination.total} NGOs
          {debouncedSearch && ` matching "${debouncedSearch}"`}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default NgoMatches;