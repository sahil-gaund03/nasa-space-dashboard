"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

const fallbackItems = [
  "ISS · 408.2 km · 7.66 km/s",
  "NEO 2026 KX1 · 0.042 AU",
  "Solar flux F10.7 · 142 sfu",
  "JWST · NIRCam exposure 4.2h",
  "CRS-42 T-3d 04h 28m",
  "Voyager 1 · 24.4 Bkm",
  "Perseverance · sol 1248",
  "DSN · Madrid 70m · LOCK",
  "Artemis II · IAR review",
  "Starship S38 · WDR complete",
];

export function Ticker() {
  const { liveTelemetry, systemLogs } = useDashboardStore();
  const [items, setItems] = useState<string[]>(fallbackItems);

  useEffect(() => {
    const list = [...fallbackItems];
    
    // Inject real-time ISS telemetry if available
    if (liveTelemetry) {
      list[0] = `ISS · ALT ${liveTelemetry.alt} km · VEL ${(liveTelemetry.velocity / 3600).toFixed(2)} km/s · LAT ${liveTelemetry.lat}° LNG ${liveTelemetry.lng}°`;
    }

    // Inject recent log event
    if (systemLogs && systemLogs.length > 0) {
      list[7] = `LOG · ${systemLogs[0].tag}: ${systemLogs[0].message}`;
    }

    setItems(list);
  }, [liveTelemetry, systemLogs]);

  const row = [...items, ...items];

  return (
    <div className="relative -mx-6 px-6 py-2.5 border-y border-border bg-white/[0.015] overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div className="ticker flex gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="font-mono text-[11px] text-muted-foreground inline-flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
export default Ticker;
