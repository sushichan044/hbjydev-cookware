import { Hono } from "hono";
import { db } from "../db/index.js";

export const recipeApp = new Hono();

recipeApp.get('/', async ctx => {
  const recipes = await db.query.recipeTable.findMany();
  return ctx.json({ recipes });
});
