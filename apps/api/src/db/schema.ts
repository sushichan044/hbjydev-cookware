import { sql } from "drizzle-orm";
import { customType, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { DID } from "../util/did.js";
import { Ingredient, Step } from "@cookware/lexicons";

const did = customType<{ data: DID }>({
  dataType() {
    return "text";
  },
});

const nowAsIsoString = sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`;

const dateIsoText = customType<{ data: Date; driverData: string }>({
  dataType() {
    return "text";
  },
  toDriver: (value) => value.toISOString(),
  fromDriver: (value) => new Date(value),
});

export const recipeTable = sqliteTable("recipes", {
  id: int('id').primaryKey().notNull().unique(),
  rkey: text('rkey').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  ingredients: text('ingredients', { mode: 'json' }).$type<Partial<Ingredient>[]>().notNull(),
  steps: text('steps', { mode: 'json' }).$type<Partial<Step>[]>().notNull(),
  createdAt: dateIsoText("created_at").notNull(),
  authorDid: did("author_did").notNull(),
}, t => ({
  unique_author_rkey: unique().on(t.rkey, t.authorDid),
}));
