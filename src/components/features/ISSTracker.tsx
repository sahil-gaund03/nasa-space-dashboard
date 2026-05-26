"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { ISSGlobe } from "../globe/ISSGlobe";
import { Users, Satellite, Compass } from "lucide-react";

interface Telemetry {
  lat: number;
  lng: number;
  alt: number;
  velocity: number;
  timestamp: number;
}

export function ISSTracker() {
  const { setLiveTelemetry } = useDashboardStore();
  const [telemetry, setTelemetryState] = useState<Telemetry>({
    lat: 28.4,
    lng: 142.7,
    alt: 408.2,
    velocity: 27580,
    timestamp: Math.floor(Date.now() / 1000)
  });
  const [crew, setCrew] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchISSData = async () => {
    try {
      const res = await fetch("/api/iss");
      if (res.ok) {
        const data = await res.json();
        if (data.telemetry) {
          setTelemetryState(data.telemetry);
          setLiveTelemetry(data.telemetry); // Sync to Zustand store
        }
        if (data.crew) {
          setCrew(data.crew);
        }
      }
    } catch (e) {
      console.error("Failed to load ISS data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchISSData();

    // Poll ISS telemetry every 4.5 seconds
    const interval = setInterval(fetchISSData, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between" id="iss-tracker">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-accent text-[10px] text-primary">ISS · ZARYA MODULE</div>
          <h3 className="mt-1.5 font-display text-xl tracking-tight">Live orbital tracker</h3>
        </div>
        <div className="flex items-center gap-1.5 select-none">
          <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
          <span className="font-accent text-[9px] text-muted-foreground">LIVE TRACKING</span>
        </div>
      </div>

      {/* Globe Container */}
      <div className="relative mt-6 aspect-[16/10] sm:aspect-[16/9] rounded-xl border border-border bg-[radial-gradient(ellipse_at_center,oklch(0.2_0.04_265),oklch(0.13_0.04_265))] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        
        {/* Three.js Globe */}
        <div className="w-full h-full absolute inset-0">
          <ISSGlobe lat={telemetry.lat} lng={telemetry.lng} />
        </div>

        <div className="absolute top-3 left-3 px-2 py-1 rounded bg-background/80 backdrop-blur border border-border font-mono text-[9px] text-muted-foreground select-none pointer-events-none">
          HOLOGRAPHIC ORBITAL MODEL
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-background/90 backdrop-blur border border-border pointer-events-none select-none">
          <Compass className="h-3 w-3 text-primary animate-spin" style={{ animationDuration: "12s" }} />
          <span className="font-mono text-[9px] text-foreground/90">
            {telemetry.lat > 0 ? `${telemetry.lat}° N` : `${Math.abs(telemetry.lat)}° S`},{" "}
            {telemetry.lng > 0 ? `${telemetry.lng}° E` : `${Math.abs(telemetry.lng)}° W`}
          </span>
        </div>
      </div>

      {/* Telemetry Stats Strip */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden text-xs">
        {[
          ["Latitude", `${telemetry.lat}°`],
          ["Longitude", `${telemetry.lng}°`],
          ["Altitude", `${telemetry.alt} km`],
          ["Velocity", `${(telemetry.velocity / 3600).toFixed(2)} km/s`],
        ].map(([k, v]) => (
          <div key={k} className="bg-surface p-3 select-none">
            <div className="font-accent text-[9px] text-muted-foreground">{k.toUpperCase()}</div>
            <div className="mt-1 font-mono text-foreground tabular-nums">{v}</div>
          </div>
        ))}
      </div>

      {/* Crew Expansion Banner */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 select-none">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>Active ISS Astronauts:</span>
        </div>
        <div className="font-mono text-foreground font-semibold flex items-center gap-1">
          <Satellite className="h-3 w-3 text-accent" />
          <span>{crew.length > 0 ? crew.length : "7"} on board</span>
        </div>
      </div>
      {crew.length > 0 && (
        <div className="mt-2 text-[10px] text-muted-foreground truncate w-full" title={crew.join(", ")}>
          Crew: {crew.slice(0, 4).join(" · ")}{crew.length > 4 ? "..." : ""}
        </div>
      )}
    </div>
  );
}
export default ISSTracker;
