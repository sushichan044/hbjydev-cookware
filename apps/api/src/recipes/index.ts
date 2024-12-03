import { Hono } from "hono";
import { db } from "../db/index.js";
import { and, eq, sql } from "drizzle-orm";
import { recipeTable } from "../db/schema.js";
import { parseDid } from "../util/did.js";
import { apiLogger } from "../logger.js";
import { RecipeCollection } from "@cookware/lexicons";

export const recipeApp = new Hono();

recipeApp.get('/', async ctx => {
  const recipes = await db.query.recipeTable.findMany({
    columns: {
      rkey: true,
      title: true,
      description: true,
      authorDid: true,
      createdAt: true,
    },
    extras: {
      uri: sql`concat(${recipeTable.authorDid}, "/", ${recipeTable.rkey})`.as('uri'),
    }
  });
  return ctx.json({ recipes });
});

recipeApp.get('/:authorDid/:rkey', async ctx => {
  const { authorDid, rkey } = ctx.req.param();
  const did = parseDid(authorDid);
  if (!did) {
    return ctx.json({
      error: 'invalid_did',
      message: 'The author DID you passed was invalid.',
    }, 400);
  }

  const recipe = await db.query.recipeTable.findFirst({
    where: and(
      eq(recipeTable.rkey, rkey),
      eq(recipeTable.authorDid, did)
    ),
    columns: { id: false },
  });

  if (!recipe) {
    return ctx.json({
      error: 'recipe_not_found',
      message: 'That recipe was not found.',
    }, 404);
  }

  return ctx.json({ recipe });
});
