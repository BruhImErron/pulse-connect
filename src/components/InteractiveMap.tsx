import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

// Fix Leaflet default icon paths in Vite bundles
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const selectedMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  score?: number;
  distance?: number;
  matchScore?: number;
}

interface InteractiveMapProps {
  markers: MarkerData[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MarkerData) => void;
  selectedMarkerId?: string;
}

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 4;

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom(), { animate: true, duration: 1 });
  }, [center, map]);

  return null;
}

function FitBounds({ markers, selectedMarkerId, center }: { markers: MarkerData[]; selectedMarkerId?: string; center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (!markers.length) {
      // No markers, center on user location
      map.setView(center, 5);
      return;
    }

    if (selectedMarkerId) {
      const selectedMarker = markers.find(marker => marker.id === selectedMarkerId);
      if (selectedMarker) {
        map.setView([selectedMarker.lat, selectedMarker.lng], Math.max(map.getZoom(), 8));
        return;
      }
    }

    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 8);
      return;
    }

    // Multiple markers - fit bounds but keep reasonable zoom
    const bounds = L.latLngBounds(
      markers.map((marker) => [marker.lat, marker.lng] as [number, number])
    );
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
  }, [markers, selectedMarkerId, center, map]);

  return null;
}


export default function InteractiveMap({
  markers,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onMarkerClick,
  selectedMarkerId,
}: InteractiveMapProps) {
  const parsedCenter: [number, number] = [center.lat, center.lng];

  return (
    <motion.div
      className="w-full h-full rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
    >
      <MapContainer
        center={parsedCenter}
        zoom={zoom}
        scrollWheelZoom
        className="w-full h-full"
        style={{ minHeight: "100%" }}
        maxZoom={12} // Prevent excessive zoom-in
        minZoom={2}  // Prevent excessive zoom-out
        maxBounds={[[-90, -180], [90, 180]]} // Constrain to world bounds
        maxBoundsViscosity={1.0} // Make bounds hard limits
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToCenter center={parsedCenter} />
        <FitBounds markers={markers} selectedMarkerId={selectedMarkerId} center={parsedCenter} />

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={marker.id === selectedMarkerId ? selectedMarkerIcon : defaultMarkerIcon}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            <Popup>
              <div className="text-sm font-sans min-w-[160px]">
                <p className="font-semibold text-foreground">{marker.name}</p>
                {marker.distance != null && (
                  <p className="text-xs text-muted-foreground">Distance: {marker.distance} km</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Match: <strong>{marker.matchScore ?? marker.score ?? 0}%</strong>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}
