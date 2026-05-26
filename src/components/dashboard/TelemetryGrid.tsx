"use client";

import { Orbit, Gauge, Rocket, Sun, Camera, Activity } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useEffect, useState } from "react";

type Stat = {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: LucideIcon;
  spark: number[];
};

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${24 - ((v - min) / range) * 20 - 2}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 24" className="w-full h-7" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.25" />
      <polygon points={`${points} 100,24 0,24`} fill="url(#sg)" />
    </svg>
  );
}

export function TelemetryGrid() {
  const { liveTelemetry, systemLogs } = useDashboardStore();
  const [asteroidCount, setAsteroidCount] = useState("4");
  const [nextLaunchMsg, setNextLaunchMsg] = useState("Next in 3d 04h");
  const [solarFlare, setSolarFlare] = useState("M 2.4");

  useEffect(() => {
    // Dynamically retrieve values from system logs / state
    if (systemLogs) {
      const neoLog = systemLogs.find(l => l.tag === "NEO");
      if (neoLog) {
        const match = neoLog.message.match(/(\d+) objects/);
        if (match) setAsteroidCount(match[1]);
      }

      const flareLog = systemLogs.find(l => l.message.includes("flare"));
      if (flareLog) {
        const match = flareLog.message.match(/Class ([CMX]\s*\d+\.\d+)/i);
        if (match) setSolarFlare(match[1]);
      }
    }
  }, [systemLogs]);

  const stats: Stat[] = [
    {
      label: "Asteroids detected",
      value: asteroidCount,
      delta: `+${asteroidCount} today`,
      trend: "up",
      icon: Orbit,
      spark: [4, 8, 6, 10, 7, 12, 9, 14, 11, 16]
    },
    {
      label: "ISS orbital speed",
      value: liveTelemetry ? liveTelemetry.velocity.toLocaleString() : "27,580",
      unit: "km/h",
      delta: "Nominal",
      trend: "flat",
      icon: Gauge,
      spark: [10, 11, 10, 10, 11, 10, 10, 11, 10, 11]
    },
    {
      label: "Upcoming launches",
      value: "14",
      delta: nextLaunchMsg,
      trend: "up",
      icon: Rocket,
      spark: [2, 3, 3, 5, 4, 6, 7, 7, 9, 11]
    },
    {
      label: "Solar activity",
      value: solarFlare,
      delta: "↑ 0.6 vs 24h",
      trend: "up",
      icon: Sun,
      spark: [3, 5, 4, 6, 5, 8, 7, 10, 9, 12]
    },
    {
      label: "Rover imagery",
      value: "12,944",
      delta: "+208 / day",
      trend: "up",
      icon: Camera,
      spark: [6, 7, 8, 7, 9, 10, 10, 12, 13, 14]
    },
    {
      label: "Active missions",
      value: "47",
      delta: "All systems green",
      trend: "flat",
      icon: Activity,
      spark: [8, 8, 9, 8, 9, 9, 9, 9, 9, 9]
    },
  ];

  return (
    <section className="reveal" id="telemetry">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="font-accent text-[10px] text-muted-foreground">OVERVIEW</div>
          <h2 className="font-display text-2xl tracking-tight mt-1">Operational telemetry</h2>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
          Updated in real-time · UTC
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {stats.map((s, i) => {
          const Icon = s.icon;
          const accentClass = i % 3 === 0 ? "text-primary" : i % 3 === 1 ? "text-secondary" : "text-accent";
          return (
            <div key={s.label} className="group relative bg-surface/80 p-5 transition hover:bg-surface-elevated select-none">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
              <div className="flex items-start justify-between">
                <div className={`h-9 w-9 rounded-lg border border-border bg-white/[0.02] grid place-items-center ${accentClass}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <span className="font-accent text-[9px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="mt-5 font-accent text-[10px] text-muted-foreground">{s.label.toUpperCase()}</div>
              <div className="mt-1.5 flex items-baseline gap-1.5">
                <div className="font-display text-3xl tracking-tight tabular-nums">{s.value}</div>
                {s.unit && <div className="text-xs text-muted-foreground">{s.unit}</div>}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className={`text-[11px] ${s.trend === "up" ? "text-signal" : s.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                  {s.delta}
                </div>
                <div className={`w-20 ${accentClass}`}>
                  <Spark data={s.spark} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default TelemetryGrid;
