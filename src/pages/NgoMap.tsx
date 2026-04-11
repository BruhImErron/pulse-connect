import { motion } from "framer-motion";
import { Map, MapPin, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const ngos = [
  { name: "HealthFirst NGO", location: "Mumbai, India", distance: "2.3 km", tags: ["Primary Care"], score: 92, lat: 19.076, lng: 72.877 },
  { name: "MedAid International", location: "Nairobi, Kenya", distance: "8,432 km", tags: ["Disease Prevention"], score: 87, lat: -1.286, lng: 36.817 },
  { name: "WellBeing Foundation", location: "São Paulo, Brazil", distance: "15,200 km", tags: ["Mental Health"], score: 81, lat: -23.55, lng: -46.633 },
  { name: "CleanWater Corps", location: "Dhaka, Bangladesh", distance: "3,100 km", tags: ["Water", "Hygiene"], score: 76, lat: 23.81, lng: 90.412 },
  { name: "TechHealth Initiative", location: "Lagos, Nigeria", distance: "10,800 km", tags: ["Telemedicine"], score: 72, lat: 6.524, lng: 3.379 },
];

const NgoMap = () => {
  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-6rem)] gap-0 -m-8">
        {/* Sidebar panel */}
        <motion.div
          className="w-80 bg-card border-r border-border p-6 overflow-y-auto shrink-0"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Map size={20} strokeWidth={1.5} className="text-primary" />
            <h2 className="text-lg font-heading font-semibold text-foreground">NGO Map</h2>
          </div>

          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-input text-foreground text-sm focus:border-primary focus:outline-none" placeholder="Search..." />
          </div>

          <div className="space-y-2">
            {ngos.map((ngo, i) => (
              <motion.div
                key={ngo.name}
                className="p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ x: 4 }}
                data-cursor-hover
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{ngo.name}</p>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin size={10} /> {ngo.distance}
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-success">{ngo.score}</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {ngo.tags.map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded-lg bg-accent text-accent-foreground">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Map area */}
        <div className="flex-1 relative bg-background">
          {/* Simulated dark map */}
          <div className="absolute inset-0 grid-overlay" style={{ opacity: 0.1 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Map size={48} strokeWidth={1} className="text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-sm">Interactive map</p>
              <p className="text-[11px] text-muted-foreground mt-1">Add react-leaflet for full map functionality</p>
            </div>
          </div>

          {/* Simulated markers */}
          {ngos.map((ngo, i) => (
            <motion.div
              key={ngo.name}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${25 + (i % 3) * 20}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.3 }}
                data-cursor-hover
              >
                <div className="w-4 h-4 rounded-full bg-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NgoMap;
