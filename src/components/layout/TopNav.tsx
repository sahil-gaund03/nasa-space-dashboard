"use client";

import { Bell, Search, Moon, Command } from "lucide-react";
import { useEffect, useState } from "react";

function useUTCClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return now;
}

export function TopNav() {
  const now = useUTCClock();
  const utc = now ? now.toISOString().slice(11, 19) : "00:00:00";
  const date = now ? now.toISOString().slice(0, 10) : "2026-05-26";

  return (
    <header className="sticky top-0 z-30 -mx-6 mb-8 px-6 py-4 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search missions, datasets, telemetry…"
              className="w-full pl-9 pr-16 py-2 text-sm rounded-lg bg-white/[0.03] border border-border focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-muted-foreground/70"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </div>
        </div>

        {/* Mobile Header Title */}
        <div className="flex-1 md:hidden font-display text-lg font-semibold pl-10">Aether</div>

        {/* Telemetry Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-white/[0.02]">
          <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
          <span className="font-accent text-[10px] text-muted-foreground">SYSTEMS NOMINAL</span>
        </div>

        {/* UTC Clock */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border bg-white/[0.02]">
          <div className="text-right leading-tight">
            <div className="font-mono text-[11px] tabular-nums text-foreground">
              {utc} <span className="text-muted-foreground text-[10px]">UTC</span>
            </div>
            <div className="font-mono text-[10px] text-muted-foreground">{date}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <button className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-white/[0.04] transition relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-white/[0.04] transition">
          <Moon className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary/40 to-accent/40 ring-1 ring-white/10 grid place-items-center text-xs font-semibold select-none">
          AE
        </div>
      </div>
    </header>
  );
}
export default TopNav;
