"use client";

import { useEffect, useState } from "react";
import { Loader2, Radio, Star, AlertTriangle, ShieldAlert } from "lucide-react";

interface Asteroid {
  id: string;
  risk: string; // "High" | "Low"
  dist: string; // "0.042 AU"
  size: string; // "84 m"
  v: string; // "12.4" km/s
  closeApproachDate?: string;
}

export function AsteroidRadar() {
  const [asteroids, setAsteroids] = useState<Asteroid[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchAsteroids = async () => {
    try {
      const res = await fetch("/api/asteroids");
      if (res.ok) {
        const data = await res.json();
        setAsteroids(data);
      }
    } catch (e) {
      console.error("Failed to load asteroids:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const favs = await res.json();
        setFavorites(favs.filter((f: any) => f.itemType === "asteroid").map((f: any) => f.itemId));
      }
    } catch (e) {
      // Silent catch
    }
  };

  const toggleFavorite = async (ast: Asteroid) => {
    const isFav = favorites.includes(ast.id);
    try {
      if (isFav) {
        const res = await fetch(`/api/favorites?itemType=asteroid&itemId=${ast.id}`, {
          method: "DELETE",
        });
        if (res.ok) setFavorites(prev => prev.filter(id => id !== ast.id));
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: "asteroid",
            itemId: ast.id,
            metadata: { risk: ast.risk, dist: ast.dist, size: ast.size, velocity: ast.v },
          }),
        });
        if (res.ok) setFavorites(prev => [...prev, ast.id]);
      }
    } catch (e) {
      console.error("Failed to toggle favorite:", e);
    }
  };

  useEffect(() => {
    fetchAsteroids();
    fetchFavorites();
  }, []);

  // Compute angles and positions for the radar map based on asteroid ID name and miss distance
  const getRadarPosition = (ast: Asteroid, index: number) => {
    const distNum = parseFloat(ast.dist.replace(" AU", "")) || 0.1;
    // Map astronomical distance (usually 0.001 - 0.25 AU) to radial radius (20% to 90%)
    const maxAU = 0.25;
    const radiusPercentage = Math.min(88, 20 + (distNum / maxAU) * 68);
    
    // Distribute angles evenly or base it on index
    const angle = (index * (360 / Math.max(1, asteroids.length)) + 45) * (Math.PI / 180);
    const x = 50 + radiusPercentage * Math.cos(angle) * 0.45;
    const y = 50 + radiusPercentage * Math.sin(angle) * 0.45;
    
    return { x, y };
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-6 lg:p-7 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
        <p className="mt-4 font-accent text-[10px] text-muted-foreground">SCANNING NEAR-EARTH SPACE FIELDS…</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 lg:p-7 flex flex-col justify-between" id="asteroids">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-accent text-[10px] text-accent">NEO MONITORING</div>
          <h3 className="mt-1.5 font-display text-xl tracking-tight">Asteroid threat radar</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground select-none pointer-events-none">
          <Radio className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span>RADAR SCAN ACTIVE</span>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-[1fr_1.1fr] gap-6 items-center">
        {/* Radar Simulation SVG */}
        <div className="relative aspect-square max-w-[260px] mx-auto w-full border border-border/20 rounded-full overflow-hidden bg-background/20 select-none">
          {/* Radar Circles */}
          {[1, 0.75, 0.5, 0.25].map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-border/30 pointer-events-none"
              style={{ inset: `${(1 - s) * 50}%` }}
            />
          ))}
          {/* Radar Grid Axes */}
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="absolute h-px w-full bg-border/30" />
            <div className="absolute w-px h-full bg-border/30" />
          </div>
          {/* Rotating Conic Sweep */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 radar-sweep" />
          </div>

          {/* Asteroid Dot Markers */}
          {asteroids.map((a, i) => {
            const { x, y } = getRadarPosition(a, i);
            const isHovered = hoveredId === a.id;
            const isHighRisk = a.risk === "High";
            
            return (
              <div
                key={a.id}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute h-2 w-2 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300
                  ${isHovered ? "scale-[1.8] z-20" : "scale-100 z-10"}
                  ${isHighRisk ? "bg-warning shadow-[0_0_10px_rgba(234,179,8,0.9)]" : "bg-primary shadow-[0_0_10px_rgba(6,182,212,0.8)]"}
                `}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {/* Glow Ring on hover */}
                {isHovered && (
                  <span className={`absolute inset-[-4px] rounded-full border animate-ping pointer-events-none
                    ${isHighRisk ? "border-warning/70" : "border-primary/70"}
                  `} />
                )}
              </div>
            );
          })}

          <div className="absolute inset-0 grid place-items-center pointer-events-none select-none">
            <span className="font-accent text-[9px] text-muted-foreground bg-background/80 px-1 py-0.5 rounded border border-border">EARTH</span>
          </div>
        </div>

        {/* Asteroid list */}
        <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border">
          {asteroids.map((a, i) => {
            const isHovered = hoveredId === a.id;
            const isFav = favorites.includes(a.id);
            const isHighRisk = a.risk === "High";

            return (
              <div
                key={a.id}
                onMouseEnter={() => setHoveredId(a.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-3 py-2 rounded-lg border transition duration-200 select-none
                  ${isHovered ? "bg-white/[0.05] border-primary/40" : "border-border bg-white/[0.02]"}
                `}
              >
                <div>
                  <div className="font-mono text-xs text-foreground flex items-center gap-1.5">
                    {isHighRisk && <ShieldAlert className="h-3.5 w-3.5 text-warning" />}
                    <span>{a.id}</span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {a.size} · {a.v} km/s
                  </div>
                </div>
                <div className="font-mono text-[10px] text-muted-foreground mr-1">
                  {a.dist}
                </div>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-accent select-none pointer-events-none
                    ${isHighRisk ? "bg-warning/15 text-warning" : "bg-signal/15 text-signal"}
                  `}
                >
                  {a.risk.toUpperCase()}
                </span>
                <button
                  onClick={() => toggleFavorite(a)}
                  className={`p-1 rounded hover:bg-white/10 transition ml-1 cursor-pointer
                    ${isFav ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"}
                  `}
                >
                  <Star className={`h-3.5 w-3.5 ${isFav ? "fill-primary text-primary" : ""}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default AsteroidRadar;
