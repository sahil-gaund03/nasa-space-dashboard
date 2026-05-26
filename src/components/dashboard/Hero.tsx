"use client";

import { ArrowUpRight, Play } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";

export function Hero() {
  const { liveTelemetry } = useDashboardStore();

  const handleWatchBriefing = () => {
    // Scroll to APOD gallery as the 'briefing'
    const apod = document.getElementById("apod");
    if (apod) {
      apod.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLaunchConsole = () => {
    // Scroll to AI assistant as the chatbot console
    const ai = document.getElementById("ai-assistant");
    if (ai) {
      ai.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative reveal" id="dashboard">
      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
        {/* LEFT */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white/[0.03]">
            <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" />
            <span className="font-accent text-[10px] text-muted-foreground">
              ORBIT 24,901 · CYCLE 7.218
            </span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
            Exploring space through
            <span className="block">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                AI &amp; data
              </span>
              <span className="text-muted-foreground/80">.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
            A realtime NASA intelligence platform that unifies scientific visualization,
            mission telemetry and AI-powered space analytics into one calm, observable surface.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={handleLaunchConsole}
              className="group inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition cursor-pointer"
            >
              Launch console
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={handleWatchBriefing}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-border bg-white/[0.02] text-sm hover:bg-white/[0.05] transition cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              Watch briefing
            </button>
          </div>

          {/* mini telemetry strip */}
          <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-border bg-border">
            {[
              {
                k: "ORBITAL VELOCITY",
                v: liveTelemetry ? liveTelemetry.velocity.toLocaleString() : "27,580",
                u: "km/h"
              },
              { k: "SIGNAL DELAY", v: "1.3", u: "sec" },
              { k: "ACTIVE PROBES", v: "112", u: "" },
            ].map((s) => (
              <div key={s.k} className="bg-background/85 px-4 py-4">
                <div className="font-accent text-[9px] text-muted-foreground">{s.k}</div>
                <div className="mt-1.5 font-display text-2xl tabular-nums tracking-tight">
                  {s.v}
                  {s.u && <span className="ml-1 text-xs text-muted-foreground font-sans">{s.u}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Earth visualization */}
        <div className="relative aspect-square w-full max-w-[560px] mx-auto select-none">
          {/* outer orbits */}
          <div className="absolute inset-0 orbit-spin-rev">
            <div className="absolute inset-[4%] rounded-full border border-border" />
          </div>
          <div className="absolute inset-[8%] rounded-full border border-border/60 orbit-spin">
            <span className="absolute -top-1 left-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
          </div>
          <div className="absolute inset-[18%] rounded-full border border-border/40 orbit-spin-rev">
            <span className="absolute top-1/2 -left-1 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(124,58,237,0.8)]" />
          </div>

          {/* glow */}
          <div className="absolute inset-[15%] rounded-full bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/20 blur-3xl pointer-events-none" />

          {/* Earth image */}
          <div className="absolute inset-[18%] rounded-full overflow-hidden ring-1 ring-white/10">
            <img
              src="/assets/earth-hero.jpg"
              alt="Earth from orbit"
              width={1920}
              height={1080}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>

          {/* floating telemetry cards */}
          <div
            className="hidden md:block absolute top-6 -right-2 lg:right-4 glass-panel rounded-xl p-3 w-44 reveal"
            style={{ animationDelay: "200ms" }}
          >
            <div className="font-accent text-[9px] text-primary">ISS · ZARYA</div>
            <div className="mt-1 font-display text-xs tabular-nums">
              {liveTelemetry ? `${liveTelemetry.lat}° N, ${liveTelemetry.lng}° E` : "28.4° N, 142.7° E"}
            </div>
            <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                style={{ width: liveTelemetry ? `${Math.abs(liveTelemetry.lat) * 2}%` : "75%" }}
              />
            </div>
            <div className="mt-1.5 font-mono text-[9px] text-muted-foreground tabular-nums">
              ALT {liveTelemetry ? liveTelemetry.alt : "408.2"} km · {(liveTelemetry ? liveTelemetry.velocity / 3600 : 7.66).toFixed(2)} km/s
            </div>
          </div>

          <div
            className="hidden md:block absolute bottom-8 -left-2 lg:left-4 glass-panel rounded-xl p-3 w-48 reveal"
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex items-center justify-between">
              <div className="font-accent text-[9px] text-accent">SOLAR FLUX</div>
              <span className="h-1.5 w-1.5 rounded-full bg-signal pulse-dot" />
            </div>
            <div className="mt-1 font-display text-sm">F10.7 · 142 sfu</div>
            <svg viewBox="0 0 100 24" className="mt-2 w-full h-6">
              <polyline
                points="0,18 10,14 20,16 30,10 40,12 50,6 60,9 70,4 80,8 90,3 100,7"
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
