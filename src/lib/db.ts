import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public";

  // Only create a real pg Pool if we have a valid DATABASE_URL
  // This prevents build-time crashes on Vercel when no DB is configured
  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (e) {
    console.warn("Failed to create Prisma client with pg adapter, using default:", e);
    // Return a bare client — won't connect but won't crash the build
    return new PrismaClient({
      log: ["error"],
    } as any);
  }
}

// Lazy initialization — only create the client when first accessed
export const prisma: PrismaClient = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
