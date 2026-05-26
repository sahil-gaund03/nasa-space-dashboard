"use client";

import {
  LayoutDashboard,
  Image as ImageIcon,
  Orbit,
  Satellite,
  Rocket,
  Sun,
  Sparkles,
  BarChart3,
  Settings,
  Mountain,
  Menu,
  X
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

const items = [
  { label: "Dashboard", id: "dashboard", icon: LayoutDashboard, badge: "LIVE" },
  { label: "Telemetry", id: "telemetry", icon: BarChart3 },
  { label: "APOD", id: "apod", icon: ImageIcon },
  { label: "ISS Tracker", id: "iss-tracker", icon: Satellite },
  { label: "Asteroids", id: "asteroids", icon: Orbit },
  { label: "Mars Rover", id: "mars-rover", icon: Mountain },
  { label: "SpaceX Launches", id: "spacex-launches", icon: Rocket },
  { label: "Space Weather", id: "space-weather", icon: Sun },
  { label: "AI Assistant", id: "ai-assistant", icon: Sparkles },
];

export function Sidebar() {
  const { activeSection, setActiveSection, sidebarOpen, setSidebarOpen } = useDashboardStore();

  const handleNav = (label: string, id: string) => {
    setActiveSection(label);
    setSidebarOpen(false);

    if (id === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      if (element) {
        // Offset to account for sticky header or top nav spacing
        const yOffset = -80; 
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  return (
    <>
      {/* Mobile Toggle Bar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 grid place-items-center rounded-xl bg-surface/80 border border-border backdrop-blur hover:bg-surface transition"
        >
          {sidebarOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed left-6 top-6 bottom-6 z-40 w-[232px] flex flex-col glass-panel rounded-2xl overflow-hidden transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-[260px] lg:translate-x-0"}
          max-lg:fixed max-lg:left-4 max-lg:top-4 max-lg:bottom-4
        `}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
              <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/20" />
              <Rocket className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-tight">Aether</div>
              <div className="font-accent text-[9px] text-muted-foreground">MISSION CONTROL</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="px-2 pb-2 font-accent text-[9px] text-muted-foreground/70">NAVIGATION</div>
          <ul className="space-y-0.5">
            {items.map((it) => {
              const isActive = activeSection === it.label;
              const Icon = it.icon;
              return (
                <li key={it.label}>
                  <button
                    onClick={() => handleNav(it.label, it.id)}
                    className={`group relative w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-white/[0.04] text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.025]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2.5 bottom-2.5 w-[2px] rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                    )}
                    <Icon className={`h-[15px] w-[15px] ${isActive ? "text-primary" : ""}`} strokeWidth={1.75} />
                    <span className="flex-1 text-left">{it.label}</span>
                    {it.badge && (
                      <span className="font-accent text-[8px] px-1.5 py-0.5 rounded bg-signal/15 text-signal">
                        {it.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* DSN Uplink Card */}
        <div className="m-3 p-3 rounded-xl border border-border bg-white/[0.02] relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-2xl" />
          <div className="relative">
            <div className="font-accent text-[9px] text-primary">UPLINK</div>
            <div className="mt-1 text-xs text-foreground/90">Deep Space Network</div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
              <span className="text-[10px] font-mono text-muted-foreground">96.4% nominal</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
export default Sidebar;
