import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";

export const imageTable = mysqlTable("images", {
  id: int("id").primaryKey().autoincrement(),
  imageID: varchar("imageID", {
    length: 50,
  }).notNull(),
  content: varchar("content", {
    length: 10000,
  }).notNull(),
});
