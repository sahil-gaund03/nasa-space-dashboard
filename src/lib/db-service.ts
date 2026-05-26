import { prisma } from "./db";

// In-memory fallbacks for zero-config run
const apodCacheMemory = new Map<string, any>();
const favoritesMemory: any[] = [];
const aiChatsMemory: any[] = [];
const systemLogsMemory: any[] = [
  { id: "1", timestamp: new Date(Date.now() - 3600000), tag: "TLE", message: "ISS state vector refreshed · ε = 0.0006" },
  { id: "2", timestamp: new Date(Date.now() - 3000000), tag: "DSN", message: "Madrid 70m acquired Voyager 1 carrier" },
  { id: "3", timestamp: new Date(Date.now() - 2400000), tag: "NEO", message: "2026 KX1 trajectory revision · -0.0004 AU" },
  { id: "4", timestamp: new Date(Date.now() - 1800000), tag: "SOL", message: "Class C 1.4 flare · region AR3842" },
  { id: "5", timestamp: new Date(Date.now() - 1200000), tag: "M2020", message: "Perseverance · sol 1248 · 142 frames" },
  { id: "6", timestamp: new Date(Date.now() - 600000), tag: "SPX", message: "CRS-42 propellant load nominal" },
  { id: "7", timestamp: new Date(Date.now() - 300000), tag: "JWST", message: "MIRI cooldown step 4 complete" },
];

// Helper to check if DB is connected/usable
async function isDbUsable(): Promise<boolean> {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost:5432/mydb")) {
    return false;
  }
  try {
    // Quick ping query
    await prisma.$executeRawUnsafe("SELECT 1");
    return true;
  } catch (e) {
    return false;
  }
}

export const dbService = {
  // APOD cache operations
  async getApod(date: string) {
    try {
      if (await isDbUsable()) {
        return await prisma.apodCache.findUnique({ where: { date } });
      }
    } catch (e) {
      console.warn("Database error in getApod, using fallback memory:", e);
    }
    return apodCacheMemory.get(date) || null;
  },

  async saveApod(date: string, title: string, explanation: string, imageUrl: string, hdImageUrl?: string, aiSummary?: string, copyright?: string) {
    const data = { date, title, explanation, imageUrl, hdImageUrl, aiSummary, copyright };
    try {
      if (await isDbUsable()) {
        return await prisma.apodCache.upsert({
          where: { date },
          update: data,
          create: data,
        });
      }
    } catch (e) {
      console.warn("Database error in saveApod, using fallback memory:", e);
    }
    apodCacheMemory.set(date, data);
    return data;
  },

  // Favorites operations
  async getFavorites(userId: string = "default-user") {
    try {
      if (await isDbUsable()) {
        return await prisma.favorite.findMany({ where: { userId } });
      }
    } catch (e) {
      console.warn("Database error in getFavorites, using fallback memory:", e);
    }
    return favoritesMemory.filter(f => f.userId === userId);
  },

  async addFavorite(itemType: string, itemId: string, metadata: any, userId: string = "default-user") {
    try {
      if (await isDbUsable()) {
        // Ensure user exists first (lazy creation)
        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId, email: `${userId}@aether.nasa` }
        });

        return await prisma.favorite.upsert({
          where: { userId_itemType_itemId: { userId, itemType, itemId } },
          update: { metadata },
          create: { userId, itemType, itemId, metadata },
        });
      }
    } catch (e) {
      console.warn("Database error in addFavorite, using fallback memory:", e);
    }
    
    const existingIndex = favoritesMemory.findIndex(
      f => f.userId === userId && f.itemType === itemType && f.itemId === itemId
    );
    const fav = { id: Math.random().toString(), userId, itemType, itemId, metadata, createdAt: new Date() };
    if (existingIndex > -1) {
      favoritesMemory[existingIndex] = fav;
    } else {
      favoritesMemory.push(fav);
    }
    return fav;
  },

  async removeFavorite(itemType: string, itemId: string, userId: string = "default-user") {
    try {
      if (await isDbUsable()) {
        return await prisma.favorite.delete({
          where: { userId_itemType_itemId: { userId, itemType, itemId } }
        });
      }
    } catch (e) {
      console.warn("Database error in removeFavorite, using fallback memory:", e);
    }

    const index = favoritesMemory.findIndex(
      f => f.userId === userId && f.itemType === itemType && f.itemId === itemId
    );
    if (index > -1) {
      favoritesMemory.splice(index, 1);
      return true;
    }
    return false;
  },

  // AI Chat operations
  async getChats(userId: string = "default-user") {
    try {
      if (await isDbUsable()) {
        return await prisma.aIChat.findMany({
          where: { userId },
          orderBy: { createdAt: "asc" }
        });
      }
    } catch (e) {
      console.warn("Database error in getChats, using fallback memory:", e);
    }
    return aiChatsMemory.filter(c => c.userId === userId);
  },

  async saveChat(prompt: string, response: string, userId: string = "default-user") {
    try {
      if (await isDbUsable()) {
        // Ensure user exists first
        await prisma.user.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId, email: `${userId}@aether.nasa` }
        });

        return await prisma.aIChat.create({
          data: { userId, prompt, response }
        });
      }
    } catch (e) {
      console.warn("Database error in saveChat, using fallback memory:", e);
    }

    const chat = { id: Math.random().toString(), userId, prompt, response, createdAt: new Date() };
    aiChatsMemory.push(chat);
    return chat;
  },

  // System log operations
  async getSystemLogs() {
    try {
      if (await isDbUsable()) {
        return await prisma.systemLog.findMany({
          orderBy: { timestamp: "desc" },
          take: 50
        });
      }
    } catch (e) {
      // Slient fallback
    }
    return [...systemLogsMemory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  async addSystemLog(tag: string, message: string) {
    try {
      if (await isDbUsable()) {
        return await prisma.systemLog.create({
          data: { tag, message }
        });
      }
    } catch (e) {
      // Silent fallback
    }

    const log = { id: Math.random().toString(), timestamp: new Date(), tag, message };
    systemLogsMemory.unshift(log);
    if (systemLogsMemory.length > 50) {
      systemLogsMemory.pop();
    }
    return log;
  }
};
