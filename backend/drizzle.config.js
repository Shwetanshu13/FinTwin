import { defineConfig } from "drizzle-kit";
import { config } from "./src/conf";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql",
    schema: "./src/db/schema.js",

    dbCredentials: {
        url: config.dbUrl,
    },
});
