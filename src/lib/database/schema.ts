import { InferSelectModel } from "drizzle-orm";
import { pgTable, smallserial, timestamp, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: varchar("id").primaryKey(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
});

export const sessionTable = pgTable("session", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const verificationTable = pgTable("verification", {
  id: smallserial("id"),
  code: varchar("code", { length: 255 }),
  userId: varchar("user_id")
    .notNull()
    .references(() => userTable.id),
  email: varchar("email"),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const postTable = pgTable("post", {
  id: smallserial("id").primaryKey(),
  content: varchar("content", { length: 255 }).notNull(),
  userId: varchar("userId")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
