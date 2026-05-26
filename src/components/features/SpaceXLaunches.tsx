"use client";

import { useEffect, useState } from "react";
import { Loader2, Rocket, Clock, Calendar } from "lucide-react";

interface TimelineEvent {
  t: string;
  e: string;
}

interface LaunchData {
  missionName: string;
  rocketName: string;
  launchDate: string;
  details: string;
  launchpad: string;
  payload: string;
  orbit: string;
  flightNumber: number;
  timeline: TimelineEvent[];
}

function useCountdown(targetDateStr: string) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    if (!targetDateStr) return;
    const target = new Date(targetDateStr).getTime();
    setDiff(target - Date.now());

    const t = setInterval(() => {
      setDiff(target - Date.now());
    }, 1000);

    return () => clearInterval(t);
  }, [targetDateStr]);

  const s = Math.max(0, Math.floor(diff / 1000));
  return {
    d: String(Math.floor(s / 86400)).padStart(2, "0"),
    h: String(Math.floor((s % 86400) / 3600)).padStart(2, "0"),
    m: String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    s: String(s % 60).padStart(2, "0"),
  };
}

export function SpaceXLaunches() {
  const [data, setData] = useState<LaunchData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLaunch = async () => {
    try {
      const res = await fetch("/api/launches");
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch (e) {
      console.error("Failed to load launch data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaunch();
  }, []);

  const c = useCountdown(data?.launchDate || "");

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <p className="mt-4 font-accent text-[10px] text-muted-foreground">RESOLVING LAUNCH TIMELINE TELEMETRY…</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="reveal" id="spacex-launches">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-px bg-border rounded-2xl overflow-hidden border border-border">
        
        {/* Left Countdown Panel */}
        <div className="relative bg-surface p-6 lg:p-8 min-h-[440px] flex flex-col justify-between">
          <img
            src="/assets/launch.jpg"
            alt="Rocket launch"
            className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none select-none"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 font-accent text-[10px] text-primary select-none">
              <Rocket className="h-4 w-4 text-primary" />
              <span>UPCOMING MISSION · FLIGHT #{data.flightNumber}</span>
            </div>
            <h3 className="mt-3 font-display text-3xl tracking-tight leading-tight">
              {data.rocketName} · {data.missionName}
            </h3>
            <p className="mt-3 text-xs text-muted-foreground max-w-md leading-relaxed">
              {data.details}
            </p>

            {/* Live Countdown Grid */}
            <div className="mt-8 grid grid-cols-4 gap-2 max-w-sm">
              {(["d", "h", "m", "s"] as const).map((k) => (
                <div key={k} className="rounded-xl border border-border bg-background/60 backdrop-blur p-3 text-center select-none">
                  <div className="font-display text-2xl sm:text-3xl tabular-nums tracking-tight text-foreground">{c[k]}</div>
                  <div className="mt-1 font-accent text-[8px] text-muted-foreground">
                    {k === "d" ? "DAYS" : k === "h" ? "HOURS" : k === "m" ? "MIN" : "SEC"}
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Vehicle Metadata */}
            <div className="mt-8 flex flex-wrap gap-3 text-[11px] select-none">
              {[
                ["Vehicle", data.rocketName],
                ["Payload", data.payload],
                ["Orbit", data.orbit],
              ].map(([k, v]) => (
                <div key={k} className="px-3 py-1.5 rounded-lg border border-border bg-background/50">
                  <div className="font-accent text-[8px] text-muted-foreground">{k.toUpperCase()}</div>
                  <div className="mt-0.5 font-mono text-foreground">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Flight Timeline Panel */}
        <div className="bg-surface p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4 select-none">
              <div className="flex items-center gap-2 font-accent text-[10px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>FLIGHT EVENT TIMELINE</span>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground">COUNTDOWN SEQUENCE</span>
            </div>
            
            <ol className="relative select-none">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              {data.timeline.map((e, i) => {
                const isTMinus = e.t.startsWith("T-");
                return (
                  <li key={i} className="relative pl-8 py-2.5 group">
                    <span
                      className={`absolute left-0 top-3.5 h-[15px] w-[15px] rounded-full border-2 transition-colors duration-300
                        ${isTMinus ? "border-primary bg-primary/20" : "border-border bg-background"}
                      `}
                    />
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-mono text-xs text-muted-foreground/80 tabular-nums">{e.t}</div>
                      <div className="text-sm text-foreground/90 font-medium">{e.e}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          
          <div className="mt-6 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-white/[0.01] text-[10px] text-muted-foreground font-mono select-none">
            <Calendar className="h-3.5 w-3.5 text-accent" />
            <span>Launch Pad: {data.launchpad}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
export default SpaceXLaunches;
