"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/useDashboardStore";

interface LogEvent {
  id: string;
  timestamp: string;
  tag: string;
  message: string;
}

const tagColor: Record<string, string> = {
  TLE: "text-primary",
  DSN: "text-secondary",
  NEO: "text-accent",
  SOL: "text-warning",
  M2020: "text-signal",
  SPX: "text-primary",
  JWST: "text-accent",
  SYS: "text-muted-foreground",
};

const simulatedEvents = [
  { tag: "DSN", message: "Goldstone 70m uplink established with Voyager 2" },
  { tag: "JWST", message: "NIRSpec microshutter array configuration finished" },
  { tag: "M2020", message: "Perseverance SHERLOC laser autofocus nominal" },
  { tag: "SOL", message: "Solar flux index increased to 146 sfu" },
  { tag: "NEO", message: "Completed automated asteroid threat trajectory sweep" },
  { tag: "TLE", message: "ISS altitude boosted +200m by Progress thrusters" },
  { tag: "SPX", message: "Starship Flight-5 landing pad review nominal" },
];

export function Realtime() {
  const [events, setEvents] = useState<LogEvent[]>([]);
  const { setSystemLogs, addSystemLog } = useDashboardStore();

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/logs");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
        setSystemLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch logs:", e);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Poll logs every 7 seconds
    const interval = setInterval(fetchLogs, 7000);
    return () => clearInterval(interval);
  }, []);

  // Simulate new background uplinks periodically
  useEffect(() => {
    const triggerSimulation = async () => {
      const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
      try {
        const res = await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(randomEvent),
        });
        if (res.ok) {
          const newLog = await res.json();
          // Add to local state and Zustand store instantly for smooth response
          setEvents((prev) => [newLog, ...prev].slice(0, 50));
          addSystemLog(newLog);
        }
      } catch (e) {
        // Silent catch
      }
    };

    // Simulate an event every 20-30 seconds
    const interval = setInterval(triggerSimulation, 22000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-7 h-full flex flex-col min-h-[320px]">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-accent text-[10px] text-muted-foreground">REALTIME EVENT STREAM</div>
          <h3 className="mt-1 font-display text-xl tracking-tight">System log · UTC</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
          <span className="font-mono text-[10px] text-muted-foreground">{events.length} logs cached</span>
        </div>
      </div>

      <ul className="mt-5 space-y-1.5 flex-1 overflow-y-auto max-h-[360px] scrollbar-thin scrollbar-thumb-border pr-2">
        {events.map((e) => {
          const time = new Date(e.timestamp).toISOString().slice(11, 19);
          return (
            <li
              key={e.id}
              className="group grid grid-cols-[auto_auto_1fr] items-baseline gap-3 px-3 py-2 -mx-3 rounded-md hover:bg-white/[0.02] transition"
            >
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums select-none">{time}</span>
              <span className={`font-accent text-[9px] w-12 text-left select-none ${tagColor[e.tag] ?? "text-foreground"}`}>
                {e.tag}
              </span>
              <span className="text-xs text-foreground/85 truncate" title={e.message}>
                {e.message}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default Realtime;
