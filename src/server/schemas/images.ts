import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const imageTable = mysqlTable("images", {
  id: int("id").autoincrement(),
  imageID: varchar("imageID", {
    length: 50,
  }).notNull(),
  content: varchar("content", {
    length: 1000000000,
  }).notNull(),
});
