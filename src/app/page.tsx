"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Ticker } from "@/components/dashboard/Ticker";
import { Hero } from "@/components/dashboard/Hero";
import { TelemetryGrid } from "@/components/dashboard/TelemetryGrid";
import { APOD } from "@/components/features/APOD";
import { ISSTracker } from "@/components/features/ISSTracker";
import { AsteroidRadar } from "@/components/features/AsteroidRadar";
import { MarsRover } from "@/components/features/MarsRover";
import { SpaceXLaunches } from "@/components/features/SpaceXLaunches";
import { SpaceWeather } from "@/components/features/SpaceWeather";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { Realtime } from "@/components/dashboard/Realtime";
import { Footer } from "@/components/layout/Footer";
import { useDashboardStore } from "@/store/useDashboardStore";

export default function Home() {
  const { setLiveTelemetry, setSystemLogs } = useDashboardStore();
  const [loading, setLoading] = useState(true);

  const fetchInitialTelemetry = async () => {
    try {
      const res = await fetch("/api/telemetry");
      if (res.ok) {
        const data = await res.json();
        if (data.iss) {
          setLiveTelemetry(data.iss);
        }
        // If logs API yields anything, we sync them
        const logsRes = await fetch("/api/logs");
        if (logsRes.ok) {
          const logs = await logsRes.json();
          setSystemLogs(logs);
        }
      }
    } catch (e) {
      console.error("Failed to load telemetry:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialTelemetry();

    // Poll telemetry every 10 seconds to keep stats synchronized without hitting limits
    const interval = setInterval(fetchInitialTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Ambient Space Starfield background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.35]" />
        {Array.from({ length: 80 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-px w-px rounded-full bg-white twinkle"
            style={{
              top: `${(i * 53) % 100}%`,
              left: `${(i * 79) % 100}%`,
              animationDelay: `${(i % 8) * 0.5}s`,
              opacity: 0.5 + ((i % 5) * 0.1),
            }}
          />
        ))}
      </div>

      <Sidebar />

      {/* Main content grid */}
      <main className="lg:pl-[272px] px-6 pt-2 pb-10 max-w-[1600px] mx-auto">
        <TopNav />
        <Ticker />

        <div className="mt-12 space-y-20">
          <Hero />
          <TelemetryGrid />
          <APOD />

          <div className="grid lg:grid-cols-2 gap-6">
            <ISSTracker />
            <AsteroidRadar />
          </div>

          <MarsRover />
          <SpaceXLaunches />
          <SpaceWeather />

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
            <AIAssistant />
            <Realtime />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
}
