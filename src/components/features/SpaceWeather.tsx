"use client";

import { useEffect, useState } from "react";
import { Loader2, Sun, Flame, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SolarFlare {
  id: string;
  class: string;
  peakTime: string;
  region: string;
}

interface CME {
  id: string;
  startTime: string;
  speed: number;
  angle: number;
}

interface SpaceWeatherData {
  solarFlares: SolarFlare[];
  cmes: CME[];
  peakFlare24h: string;
  cmeProbability: number;
}

function Heatmap() {
  // Generate a premium matrix grid of 12 x 5 dots indicating sensor sweeps
  return (
    <div className="grid grid-cols-12 gap-1.5 select-none pointer-events-none">
      {Array.from({ length: 12 * 4 }).map((_, i) => {
        // High density cluster around center
        const col = i % 12;
        const row = Math.floor(i / 12);
        const distFromCenter = Math.sqrt(Math.pow(col - 5.5, 2) + Math.pow(row - 1.5, 2));
        const intensity = Math.max(0.1, 0.95 - distFromCenter * 0.15 + Math.random() * 0.15);

        return (
          <div
            key={i}
            className="aspect-square rounded-md transition-all duration-500"
            style={{
              background: `oklch(${0.25 + intensity * 0.4} ${0.05 + intensity * 0.18} ${220 + intensity * 60})`,
              opacity: 0.35 + intensity * 0.65,
            }}
          />
        );
      })}
    </div>
  );
}

export function SpaceWeather() {
  const [data, setData] = useState<SpaceWeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      const res = await fetch("/api/weather");
      if (res.ok) {
        const payload = await res.json();
        setData(payload);
      }
    } catch (e) {
      console.error("Failed to load space weather:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <p className="mt-4 font-accent text-[10px] text-muted-foreground">SCANNING HELIOSPHERIC SENSOR DATA…</p>
      </div>
    );
  }

  if (!data) return null;

  // Format flare class values (e.g. C1.4 -> 1.4, M2.4 -> 24, X1.0 -> 100) to render on Recharts line
  const chartData = data.solarFlares.map((f) => {
    const time = new Date(f.peakTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let val = 1.0;
    const match = f.class.match(/([CMX])\s*(\d+\.\d+|\d+)/i);
    if (match) {
      const c = match[1].toUpperCase();
      const n = parseFloat(match[2]);
      if (c === "C") val = n;
      else if (c === "M") val = n * 10;
      else if (c === "X") val = n * 100;
    }
    return {
      time,
      intensity: val,
      originalClass: f.class,
      region: f.region,
    };
  });

  return (
    <section className="reveal" id="space-weather">
      <div className="flex items-end justify-between mb-6 select-none">
        <div>
          <div className="font-accent text-[10px] text-muted-foreground">HELIOSPHERE MONITORING</div>
          <h2 className="font-display text-2xl tracking-tight mt-1">Space weather analytics</h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
        
        {/* Left Solar Flare Area Chart */}
        <div className="bg-surface p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-baseline justify-between select-none">
              <div>
                <div className="flex items-center gap-1.5 font-accent text-[10px] text-primary">
                  <Flame className="h-4 w-4 text-primary animate-pulse" />
                  <span>SOLAR FLARE RADIAL PLOT</span>
                </div>
                <div className="mt-2 font-display text-3xl tracking-tight">
                  {data.peakFlare24h} <span className="text-sm text-muted-foreground">peak index</span>
                </div>
              </div>
              <div className="flex gap-2 text-[10px] font-accent">
                <span className="px-2 py-0.5 rounded bg-white/[0.06] text-foreground">FLR SWEEP</span>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="mt-8 h-36 w-full font-mono text-[9px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="flareColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.78 0.15 220)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="oklch(0.78 0.15 220)" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="oklch(0.72 0.025 250 / 0.3)" />
                  <YAxis stroke="oklch(0.72 0.025 250 / 0.3)" />
                  <Tooltip
                    contentStyle={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px" }}
                    labelClassName="text-muted-foreground font-mono text-[10px]"
                    itemStyle={{ color: "#fff", fontFamily: "monospace", fontSize: "11px" }}
                    formatter={(value: any, name: any, props: any) => [props.payload.originalClass, "Class"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="intensity"
                    stroke="oklch(0.78 0.15 220)"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#flareColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between font-mono text-[9px] text-muted-foreground select-none pointer-events-none">
            <span>PAST 24 HOURS</span>
            <span>UPLINK TICK NOMINAL</span>
          </div>
        </div>

        {/* Right CME Probability Heatmap */}
        <div className="bg-surface p-6 flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="flex items-center gap-1.5 font-accent text-[10px] text-accent select-none">
              <Sun className="h-4 w-4 text-accent" />
              <span>CME PROBABILITY · 60H</span>
            </div>
            <div className="mt-2 font-display text-3xl tracking-tight">
              {data.cmeProbability}<span className="text-lg text-muted-foreground">%</span>
            </div>
            <div className="mt-6">
              <Heatmap />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground select-none">
            <span>LOW DENSITY</span>
            <span>HIGH SHOCK</span>
          </div>
        </div>

      </div>
    </section>
  );
}
export default SpaceWeather;
