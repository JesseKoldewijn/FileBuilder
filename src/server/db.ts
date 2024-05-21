import { env } from "~/env";
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";

import { schema } from "./schemas";

const connection = await createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  port: env.DB_PORT,
  compress: true,
});

export const db = drizzle(connection, {
  schema: schema,
  mode: "default",
});
