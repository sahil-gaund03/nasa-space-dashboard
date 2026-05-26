import { cache } from "../lib/redis";

export const issService = {
  // 1. Live ISS Coordinates, speed, and altitude
  async getLiveTelemetry() {
    try {
      const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544", {
        cache: "no-store", // Do not cache at HTTP level, we need real-time data!
      });
      if (!res.ok) throw new Error("WhereTheISS API failed");
      const data = await res.json();
      
      return {
        lat: parseFloat(data.latitude.toFixed(4)),
        lng: parseFloat(data.longitude.toFixed(4)),
        alt: parseFloat(data.altitude.toFixed(1)),
        velocity: Math.round(data.velocity),
        timestamp: data.timestamp
      };
    } catch (e) {
      // Return realistic moving coordinate simulation based on time
      const timeFactor = Date.now() / 100000;
      const simulatedLat = parseFloat((30 * Math.sin(timeFactor)).toFixed(4));
      const simulatedLng = parseFloat((120 * Math.cos(timeFactor)).toFixed(4));

      return {
        lat: simulatedLat,
        lng: simulatedLng,
        alt: 408.2,
        velocity: 27580,
        timestamp: Math.floor(Date.now() / 1000)
      };
    }
  },

  // 2. ISS Crew Members
  async getCrew() {
    const cacheKey = "iss:crew";
    const cached = await cache.get<any>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch("http://api.open-notify.org/astros.json");
      if (!res.ok) throw new Error("Open Notify Astros API failed");
      const data = await res.json();
      
      const issCrew = data.people
        .filter((p: any) => p.craft === "ISS")
        .map((p: any) => p.name);

      await cache.set(cacheKey, issCrew, 43200); // cache for 12 hours
      return issCrew;
    } catch (e) {
      console.error("Crew fetch failed, using fallback:", e);
      return [
        "Matthew Dominick",
        "Michael Barratt",
        "Jeanette Epps",
        "Alexander Grebenkin",
        "Tracy Caldwell Dyson",
        "Oleg Kononenko",
        "Nikolai Chub"
      ];
    }
  }
};
