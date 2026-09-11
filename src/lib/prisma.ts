import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

// Prisma va PG Pool ni global obyeqtga biriktirish
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

// Next.js qayta yuklanganda yangi Pool yaratmaslik uchun global context'dan olish
const pool =
globalForPrisma.pool ??
new Pool({
    connectionString,
    max: 10, // Ulanishlar limitini chegaralash (Supabase/Postgres ulanish xatosini oldini oladi)
});

const adapter = new PrismaPg(pool);

export const prisma =
globalForPrisma.prisma ??
new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
    globalForPrisma.pool = pool;
}