import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  const msg =
    "Missing environment variable DATABASE_URL.\n" +
    "Set DATABASE_URL in your environment or .env file (see .env.example).";
  if (process.env.NODE_ENV === "production") {
    throw new Error(msg);
  } else {
    // Warn in development so local workflows can be fixed quickly
    // without failing the whole process immediately.
    // Prisma will still throw if it tries to connect without the URL.
    // eslint-disable-next-line no-console
    console.warn(msg);
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
