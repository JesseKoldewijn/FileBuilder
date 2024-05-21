import type { Config } from "drizzle-kit";

import { env } from "./src/env.js";

const config = {
  schema: "./src/server/schemas/*.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    port: env.DB_PORT,
  },
} satisfies Config;

export default config;
