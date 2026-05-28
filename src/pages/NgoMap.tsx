/**
 * NgoMap.tsx - Interactive NGO Discovery Map Page
 * Purpose: Displays NGOs on an interactive satellite map with location-based filtering and matching
 * Key Features:
 *   - Geolocation-aware NGO ranking (closest first)
 *   - Real-time search filtering (name, location, tags)
 *   - Interactive map markers for each NGO
 *   - One-click volunteer application
 *   - Automatic fallback to India center if geolocation denied
 */

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Map, MapPin, Search, Loader2, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import InteractiveMap from "@/components/InteractiveMap";
import { api, type Ngo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NgoMap = () => {
  // ===== STATE MANAGEMENT =====
  // Purpose: Track UI state and user interactions
  const [selectedNgo, setSelectedNgo] = useState<Ngo | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const queryClient = useQueryClient();
  const defaultLocation = { lat: 20.5937, lng: 78.9629 };

  // Debounce search to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ===== GEOLOCATION EFFECT =====
  // Purpose: Get user's current location for distance-based NGO ranking
  // How it works:
  //   1. Check if browser supports Geolocation API
  //   2. Request user's permission to access location
  //   3. On success: Store latitude/longitude, clear error
  //   4. On error: Set fallback location (India center), show user-friendly error message
  //   5. Error scenarios: User denies permission, GPS unavailable, timeout
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
        },
        error => {
          console.warn("Geolocation error:", error);
          setLocationError("Location access denied. Showing NGOs worldwide.");
          setUserLocation(defaultLocation);
        }
      );
    } else {
      setLocationError("Geolocation is unavailable in your browser. Showing NGOs worldwide.");
      setUserLocation(defaultLocation);
    }
  }, []);

  // ===== NGO DATA FETCHING =====
  // Purpose: Fetch NGOs for map markers and sidebar list separately
  // How it works:
  //   1. Paginated sidebar keeps list rendering lightweight
  //   2. Map loads a limited marker set for better performance
  //   3. Search is debounced to reduce query volume
  const { data: allNgosData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["ngos-all", userLocation?.lat ?? null, userLocation?.lng ?? null, debouncedSearch],
    queryFn: () => api.ngos.list({
      lat: userLocation?.lat,
      lon: userLocation?.lng,
      limit: 150,
      search: debouncedSearch,
    }),
    enabled: userLocation !== null,
  });

  const { data: paginatedData, isLoading: isLoadingPaginated } = useQuery({
    queryKey: ["ngos-paginated", userLocation?.lat ?? null, userLocation?.lng ?? null, currentPage, debouncedSearch],
    queryFn: () => api.ngos.list({
      lat: userLocation?.lat,
      lon: userLocation?.lng,
      page: currentPage,
      limit: 20, // Show 20 NGOs per page in sidebar
      search: debouncedSearch,
    }),
    enabled: userLocation !== null,
  });

  // Extract NGOs from query results
  const allNgos = allNgosData?.data.ngos || [];
  const paginatedNgos = paginatedData?.data.ngos || [];
  const pagination = paginatedData?.data.pagination;
  const isLoading = isLoadingAll || isLoadingPaginated;

  const mapMarkers = useMemo(
    () =>
      allNgos.slice(0, 150).map((ngo) => ({
        id: ngo.id,
        name: ngo.name,
        lat: ngo.latitude,
        lng: ngo.longitude,
        score: ngo.score,
        distance: ngo.distance,
        matchScore: ngo.matchScore,
      })),
    [allNgos]
  );

  // ===== APPLICATION MUTATION =====
  // Purpose: Handle user volunteer application to an NGO
  // How it works:
  //   1. Mutate on button click with NGO ID and role
  //   2. API creates/updates application record in database
  //   3. On success: Invalidate NGO query to refresh isApplied status
  //   4. Loading state prevents double-submission
  const { toast } = useToast();

  const applyMutation = useMutation({
    mutationFn: (data: { ngoId: string; role: string }) =>
      api.ngos.apply(data.ngoId, data.role),
    onMutate: async ({ ngoId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["ngos-all"] }),
        queryClient.cancelQueries({ queryKey: ["ngos-paginated"] }),
      ]);

      const previousAll = queryClient.getQueryData<{ data: { ngos: Ngo[] } }>(["ngos-all"]);
      const previousPaginated = queryClient.getQueryData<{ data: { ngos: Ngo[] } }>(["ngos-paginated"]);

      const patchFn = (oldData: any) => {
        if (!oldData?.data?.ngos) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ngos: oldData.data.ngos.map((ngo: Ngo) =>
              ngo.id === ngoId ? { ...ngo, isApplied: true, matchScore: ngo.score + 5 } : ngo
            ),
          },
        };
      };

      queryClient.setQueryData(["ngos-all"], patchFn);
      queryClient.setQueryData(["ngos-paginated"], patchFn);
      return { previousAll, previousPaginated };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngos-all"] });
      queryClient.invalidateQueries({ queryKey: ["ngos-paginated"] });
      if (selectedNgo) {
        setSelectedNgo({ ...selectedNgo, isApplied: true });
      }
      toast({
        title: "Application sent",
        description: "Your volunteer request has been submitted successfully.",
      });
    },
    onError: (_error, _variables, context) => {
      toast({
        title: "Application failed",
        description: "Unable to submit your application. Please try again.",
        variant: "destructive",
      });
      if (context?.previousAll) {
        queryClient.setQueryData(["ngos-all"], context.previousAll);
      }
      if (context?.previousPaginated) {
        queryClient.setQueryData(["ngos-paginated"], context.previousPaginated);
      }
    },
  });

  // ===== SEARCH FILTERING =====
  // Purpose: Keep sidebar rendering fast by using already-paginated results
  const filteredNgos = paginatedNgos;

  // ===== EVENT HANDLERS =====
  /**
   * handleApply()
   * Purpose: Trigger volunteer application mutation when user clicks Apply button
   * How it works:
   *   1. Extract ngoId from selected NGO
   *   2. Set role to "volunteer" (default generic role)
   *   3. Trigger mutation which sends request to API
   *   4. Button shows "Applying..." during request
   *   5. On success, NGO relists show "Already Applied"
   */
  const handleApply = (ngoId: string) => {
    applyMutation.mutate({ ngoId, role: "volunteer" });
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)] gap-0 -m-8">
        {/* ===== SIDEBAR: NGO LIST AND DETAILS ===== */}
        <motion.div
          className="w-80 bg-card border-r border-border p-6 overflow-y-auto shrink-0 flex flex-col"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          {/* Header: "NGO Map" title with icon */}
          <div className="flex items-center gap-2 mb-6">
            <Map size={20} strokeWidth={1.5} className="text-primary" />
            <h2 className="text-lg font-heading font-semibold text-foreground">NGO Map</h2>
          </div>

          {/* Geolocation error message (if permission denied) */}
          {locationError && (
            <div className="mb-4 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex gap-2">
              <AlertCircle size={14} className="text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">{locationError}</p>
            </div>
          )}

          {/* Search box: Filter NGOs by name, location, or tags */}
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none"
              placeholder="Search NGOs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* NGO List */}
          {isLoading ? (
            // Loading state: Show spinner while fetching NGOs
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          ) : (
            // NGO List Items: Scrollable list of matching NGOs
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredNgos.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No NGOs found</p>
              ) : (
                filteredNgos.map((ngo) => (
                  <button
                    key={ngo.id}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-150 ${
                      selectedNgo?.id === ngo.id
                        ? "bg-primary/10 border border-primary"
                        : "hover:bg-secondary cursor-pointer border border-transparent"
                    }`}
                    data-cursor-hover
                    onClick={() => setSelectedNgo(ngo)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* NGO Name */}
                        <p className="text-sm font-semibold text-foreground">{ngo.name}</p>
                        {/* Location with icon */}
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
                          <MapPin size={10} /> {ngo.location}
                        </div>
                        {/* Distance from user (if location available) */}
                        {ngo.distance && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {ngo.distance} km away
                          </p>
                        )}
                      </div>
                      {/* Match score percentage: Higher score = better match */}
                      <span className="font-mono text-sm font-bold text-success ml-2">
                        {ngo.matchScore || ngo.score}%
                      </span>
                    </div>
                    {/* Tags: Show first 3 tags (e.g., "healthcare", "emergency") */}
                    {ngo.tags && ngo.tags.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {ngo.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="text-[9px] px-2 py-0.5 rounded-lg bg-accent text-accent-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {/* Selected NGO Details Panel */}
          {selectedNgo && (
            <motion.div
              className="mt-6 pt-6 border-t border-border"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-semibold text-sm text-foreground mb-2">Selected NGO</p>
              <div className="space-y-2 text-sm">
                {/* NGO Name and Description */}
                <p className="font-medium text-foreground">{selectedNgo.name}</p>
                {selectedNgo.description && (
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {selectedNgo.description}
                  </p>
                )}
                {/* Match Score and Distance display */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>Match Score: {selectedNgo.matchScore || selectedNgo.score}%</span>
                  {selectedNgo.distance && <span>{selectedNgo.distance} km</span>}
                </div>

                {/* Apply Button or "Already Applied" status */}
                {!selectedNgo.isApplied && (
                  <button
                    onClick={() => handleApply(selectedNgo.id)}
                    disabled={applyMutation.isPending}
                    className="w-full mt-4 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {applyMutation.isPending ? "Applying..." : "Apply to Volunteer"}
                  </button>
                )}
                {selectedNgo.isApplied && (
                  <p className="w-full mt-4 px-3 py-2 rounded-lg bg-success/20 text-success text-xs font-medium text-center">
                    ✓ Already Applied
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ===== MAP AREA: INTERACTIVE SATELLITE MAP ===== */}
        <div className="flex-1 relative bg-background overflow-hidden">
          {filteredNgos.length > 0 ? (
            // Map with NGO markers
            // Purpose: Display searchable NGO locations on satellite map
            // How it works:
            //   - Pass filtered NGO list as markers with coordinates
            //   - Center map on user location or fallback location
            //   - Highlight selected NGO marker
            //   - Click marker to select NGO in sidebar
            <InteractiveMap
              markers={mapMarkers}
              center={userLocation || defaultLocation}
              zoom={5}
              selectedMarkerId={selectedNgo?.id}
              onMarkerClick={ngo => {
                const selected = allNgos.find((n) => n.id === ngo.id);
                if (selected) setSelectedNgo(selected);
              }}
            />
          ) : isLoading || userLocation === null ? (
            // Loading state: Show spinner while fetching location/NGOs
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            // Empty state: No NGOs found in filtered results
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Map size={48} strokeWidth={1} className="text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground text-sm">No NGOs found near you</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NgoMap;
