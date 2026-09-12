import dotenv from "dotenv";
import { defineConfig } from "@prisma/config";

// Standard .env o'rniga .env.local faylini yuklaymiz
dotenv.config({ path: ".env.local" });

export default defineConfig({
    schema: "./prisma/schema.prisma",
    datasource: {
        url: process.env.DATABASE_URL,
    },
});