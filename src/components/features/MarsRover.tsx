"use client";

import { useEffect, useState } from "react";
import { Loader2, Camera, Eye, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Shot {
  id: string | number;
  src: string;
  sol: number;
  cam: string;
  rover: string;
  title: string;
  date: string;
}

const rovers = ["perseverance", "curiosity"];
const cameras = ["MAST-Z", "NAVCAM", "HAZCAM"];

export function MarsRover() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [activeRover, setActiveRover] = useState("perseverance");
  const [activeCamera, setActiveCamera] = useState("NAVCAM");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Dialog State
  const [selectedShot, setSelectedShot] = useState<Shot | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const fetchShots = async (rover: string, camera: string, pageNum: number, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      // Map display camera name to NASA API camera abbreviation if needed
      // e.g. MAST-Z -> mast, NAVCAM -> navcam, HAZCAM -> hazcam
      const camParam = camera === "MAST-Z" ? "mast" : camera.toLowerCase();
      const res = await fetch(`/api/mars?rover=${rover}&camera=${camParam}&page=${pageNum}`);
      if (res.ok) {
        const data = await res.json();
        if (append) {
          setShots((prev) => [...prev, ...data]);
          if (data.length < 12) setHasMore(false);
        } else {
          setShots(data);
          setHasMore(data.length >= 12);
        }
      }
    } catch (e) {
      console.error("Failed to load Mars photos:", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRoverChange = (rover: string) => {
    setActiveRover(rover);
    setPage(1);
    fetchShots(rover, activeCamera, 1);
  };

  const handleCameraChange = (camera: string) => {
    setActiveCamera(camera);
    setPage(1);
    fetchShots(activeRover, camera, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchShots(activeRover, activeCamera, nextPage, true);
  };

  const handleViewDetails = async (shot: Shot) => {
    setSelectedShot(shot);
    setAiSummary("");
    setAnalyzing(true);
    try {
      const res = await fetch("/api/mars/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: shot.src }),
      });
      if (res.ok) {
        const result = await res.json();
        setAiSummary(result.summary);
      }
    } catch (e) {
      setAiSummary("Geological analysis offline.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchShots(activeRover, activeCamera, 1);
  }, []);

  return (
    <section className="reveal" id="mars-rover">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4 select-none">
        <div>
          <div className="font-accent text-[10px] text-muted-foreground">MARS IMAGERY EXPLORER</div>
          <h2 className="font-display text-2xl tracking-tight mt-1">Planetary surface archives</h2>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-white/[0.02]">
            {rovers.map((r) => (
              <button
                key={r}
                onClick={() => handleRoverChange(r)}
                className={`px-3 py-1.5 rounded-md font-accent text-[10px] uppercase transition cursor-pointer
                  ${activeRover === r ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"}
                `}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-white/[0.02]">
            {cameras.map((c) => (
              <button
                key={c}
                onClick={() => handleCameraChange(c)}
                className={`px-3 py-1.5 rounded-md font-accent text-[10px] transition cursor-pointer
                  ${activeCamera === c ? "bg-white/[0.06] text-foreground" : "text-muted-foreground hover:text-foreground"}
                `}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
          <p className="mt-4 font-accent text-[10px] text-muted-foreground">CONNECTING RECONNAISSANCE UPLINK…</p>
        </div>
      ) : shots.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center">
          <p className="text-sm text-muted-foreground">No photos found for this camera/rover configuration on this sol.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shots.map((s, i) => (
              <figure
                key={s.id || i}
                onClick={() => handleViewDetails(s)}
                className="group relative rounded-2xl overflow-hidden border border-border bg-surface aspect-[4/5] cursor-pointer"
              >
                <img
                  src={s.src}
                  alt={s.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex gap-2 pointer-events-none select-none">
                  <span className="px-2 py-1 rounded-md bg-background/70 backdrop-blur border border-border font-mono text-[10px] text-foreground/90">
                    SOL {s.sol}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-background/70 backdrop-blur border border-border font-accent text-[9px] text-primary">
                    {s.cam}
                  </span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 rounded-lg bg-background/80 backdrop-blur border border-border grid place-items-center">
                  <Eye className="h-4 w-4 text-foreground" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-5 select-none pointer-events-none">
                  <div className="font-display text-lg leading-tight truncate">{s.title}</div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground">{s.date}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-border bg-white/[0.02] text-xs hover:bg-white/[0.05] transition cursor-pointer select-none disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>LOAD PIPELINE ACTIVE…</span>
                  </>
                ) : (
                  <span>FETCH NEXT SECTOR</span>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Multimodal Dialog Overlay */}
      <Dialog open={selectedShot !== null} onOpenChange={() => setSelectedShot(null)}>
        {selectedShot && (
          <DialogContent className="max-w-[700px] border border-border bg-background/95 backdrop-blur-md rounded-2xl overflow-hidden p-0 gap-0">
            <div className="relative aspect-[4/3] w-full bg-black">
              <img
                src={selectedShot.src}
                alt={selectedShot.title}
                className="h-full w-full object-contain"
              />
              <div className="absolute top-4 left-4 px-2 py-1 rounded bg-background/85 border border-border font-mono text-[9px] text-primary select-none">
                {selectedShot.rover.toUpperCase()} · SOL {selectedShot.sol}
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs font-accent text-accent select-none mb-1">
                  <Camera className="h-4 w-4" />
                  <span>{selectedShot.cam} IMAGERY DATAFEED</span>
                </div>
                <DialogTitle className="font-display text-xl leading-tight">{selectedShot.title}</DialogTitle>
                <DialogDescription className="font-mono text-[10px] text-muted-foreground mt-1 select-none">
                  Earth Date: {selectedShot.date} · Camera: {selectedShot.cam}
                </DialogDescription>
              </DialogHeader>

              {/* Multimodal AI Summary */}
              <div className="mt-5 p-4 rounded-xl border border-primary/20 bg-primary/[0.02] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />
                <div className="flex items-center gap-2 font-accent text-[9px] text-primary mb-2 select-none">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AETHER AI GEOLOGICAL CLASSIFICATION</span>
                </div>
                
                {analyzing ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                    <span className="font-accent text-[9px] text-muted-foreground uppercase">ANALYZING SPECIMEN LAYER VIA GEMINI VISION…</span>
                  </div>
                ) : (
                  <p className="text-xs text-foreground/90 italic leading-relaxed font-sans">
                    &ldquo;{aiSummary || "No mineral classification available."}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
export default MarsRover;
