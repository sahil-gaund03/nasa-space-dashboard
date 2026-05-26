"use client";

import { useEffect, useState } from "react";
import { Calendar, Download, Maximize2, Sparkles, Star, Loader2 } from "lucide-react";

interface ApodData {
  date: string;
  title: string;
  explanation: string;
  imageUrl: string;
  hdImageUrl?: string;
  copyright?: string;
  aiSummary?: string;
}

export function APOD() {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const fetchAPOD = async (selectedDate?: string) => {
    setLoading(true);
    try {
      const url = selectedDate ? `/api/apod?date=${selectedDate}` : "/api/apod";
      const res = await fetch(url);
      if (res.ok) {
        const apod = await res.json();
        setData(apod);
        setDate(apod.date);
        checkIfFavorite(apod.date);
      }
    } catch (e) {
      console.error("Failed to load APOD:", e);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (apodDate: string) => {
    try {
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const favs = await res.json();
        const found = favs.some((f: any) => f.itemType === "apod" && f.itemId === apodDate);
        setIsFavorite(found);
      }
    } catch (e) {
      // Silent catch
    }
  };

  const toggleFavorite = async () => {
    if (!data || favLoading) return;
    setFavLoading(true);
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites?itemType=apod&itemId=${data.date}`, {
          method: "DELETE",
        });
        if (res.ok) setIsFavorite(false);
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType: "apod",
            itemId: data.date,
            metadata: { title: data.title, imageUrl: data.imageUrl },
          }),
        });
        if (res.ok) setIsFavorite(true);
      }
    } catch (e) {
      console.error("Failed to toggle favorite:", e);
    } finally {
      setFavLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchAPOD(e.target.value);
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-10 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="mt-4 font-accent text-xs text-muted-foreground">FETCHING HIGH-RES COSMIC TELEMETRY…</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="reveal" id="apod">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
        <div>
          <div className="font-accent text-[10px] text-muted-foreground">ASTRONOMY PICTURE OF THE DAY</div>
          <h2 className="font-display text-2xl tracking-tight mt-1">Digital science gallery</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2 rounded-lg border border-border bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={handleDateChange}
              className="bg-transparent border-none text-foreground focus:outline-none cursor-pointer"
            />
          </div>
          <button
            onClick={toggleFavorite}
            disabled={favLoading}
            className={`h-9 px-3 rounded-lg border border-border flex items-center gap-2 text-xs transition cursor-pointer select-none
              ${isFavorite ? "bg-primary/10 text-primary border-primary/30" : "bg-white/[0.02] text-muted-foreground hover:text-foreground"}
            `}
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            {isFavorite ? "Favorited" : "Favorite"}
          </button>
        </div>
      </div>

      <article className="relative grid lg:grid-cols-[1.4fr_1fr] gap-px bg-border rounded-2xl overflow-hidden border border-border">
        {/* Photo Container */}
        <div className="relative bg-surface aspect-[16/10] lg:aspect-auto min-h-[350px]">
          <img
            src={data.imageUrl}
            alt={data.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/10 to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none select-none">
            <span className="px-2 py-1 rounded-md bg-background/80 backdrop-blur border border-border font-accent text-[9px] text-primary">
              NASA · APOD
            </span>
            <span className="px-2 py-1 rounded-md bg-background/80 backdrop-blur border border-border font-mono text-[10px] text-muted-foreground">
              {data.date}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <a
              href={data.hdImageUrl || data.imageUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 grid place-items-center rounded-lg bg-background/80 backdrop-blur border border-border hover:bg-background transition text-foreground"
            >
              <Download className="h-4 w-4" />
            </a>
            <a
              href={data.hdImageUrl || data.imageUrl}
              target="_blank"
              rel="noreferrer"
              className="h-9 w-9 grid place-items-center rounded-lg bg-background/80 backdrop-blur border border-border hover:bg-background transition text-foreground"
            >
              <Maximize2 className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Info Column */}
        <div className="bg-surface p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="font-accent text-[10px] text-accent tracking-widest">NGC VIEWPORT · ARCHIVE</div>
            <h3 className="mt-3 font-display text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.1] tracking-tight text-balance">
              {data.title}
            </h3>

            {/* AI Summary Section */}
            {data.aiSummary && (
              <div className="mt-5 p-4 rounded-xl border border-primary/20 bg-primary/[0.02] relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl pointer-events-none" />
                <div className="flex items-center gap-2 font-accent text-[9px] text-primary mb-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AETHER AI GEOLOGICAL INTERPRETATION</span>
                </div>
                <p className="text-xs text-foreground/90 italic leading-relaxed font-sans">
                  &ldquo;{data.aiSummary}&rdquo;
                </p>
              </div>
            )}

            <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border">
              {data.explanation}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground select-none">
            <span>CREDIT: {data.copyright || "NASA · ESA"}</span>
            <span>UPLINK ACTIVE</span>
          </div>
        </div>
      </article>
    </section>
  );
}
export default APOD;
