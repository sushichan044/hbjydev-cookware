import { Hono } from 'hono';
import { db } from '../db/index.js';
import { recipeTable } from '../db/schema.js';
import { sql } from 'drizzle-orm';
import { Recipe, RecipeCollection } from '@cookware/lexicons';

export const xrpcApp = new Hono();

xrpcApp.get('/moe.hayden.cookware.getRecipes', async ctx => {
  const recipes = await db.query.recipeTable.findMany({
    columns: {
      rkey: true,
      title: true,
      description: true,
      ingredients: true,
      steps: true,
      createdAt: true,
      authorDid: true,
    },
    extras: {
      uri: sql`concat(${recipeTable.authorDid}, "/", ${recipeTable.rkey})`.as('uri'),
    }
  });
  return ctx.json({
    recipes: recipes.map(r => ({
      rkey: r.rkey,
      did: r.authorDid,
      title: r.title,
      description: r.description,
      ingredients: r.ingredients,
      steps: r.steps,
    })),
  });
});

xrpcApp.use(async c => {
  c.status(400);
  return c.json({
    error: 'not_implemented',
    message: 'The XRPC server has not yet been implemented.',
  });
});
