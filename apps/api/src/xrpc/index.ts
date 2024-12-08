import { Hono } from 'hono';
import { db } from '../db/index.js';
import { recipeTable } from '../db/schema.js';
import { and, eq, sql } from 'drizzle-orm';
import { parseDid } from '../util/did.js';

export const xrpcApp = new Hono();

xrpcApp.get('/moe.hayden.cookware.getRecipes', async ctx => {
  const recipes = await db.select({
    rkey: recipeTable.rkey,
    title: recipeTable.title,
    description: recipeTable.description,
    ingredientsCount: sql`json_array_length(${recipeTable.ingredients})`,
    stepsCount: sql`json_array_length(${recipeTable.steps})`,
    createdAt: recipeTable.createdAt,
    authorDid: recipeTable.authorDid,
    uri: sql`concat(${recipeTable.authorDid}, "/", ${recipeTable.rkey})`.as('uri'),
  }).from(recipeTable);

  return ctx.json({
    recipes: recipes.map(r => ({
      rkey: r.rkey,
      did: r.authorDid,
      title: r.title,
      description: r.description,
      ingredients: r.ingredientsCount,
      steps: r.stepsCount ,
    })),
  });
});

xrpcApp.get('/moe.hayden.cookware.getRecipe', async ctx => {
  const { did, rkey } = ctx.req.query();
  if (!did) throw new Error('Invalid DID');
  if (!rkey) throw new Error('Invalid rkey');

  const parsedDid = parseDid(did);
  if (!parsedDid) throw new Error('Invalid DID');

  const recipe = await db.query.recipeTable.findFirst({
    where: and(
      eq(recipeTable.authorDid, parsedDid),
      eq(recipeTable.rkey, rkey),
    ),
  });

  if (!recipe) {
    ctx.status(404);
    return ctx.json({
      error: 'not_found',
      message: 'No such recipe was found in the index.',
    });
  }

  return ctx.json({
    recipe: {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
    },
  });
});

xrpcApp.use(async c => {
  c.status(400);
  return c.json({
    error: 'not_implemented',
    message: 'The XRPC server has not yet been implemented.',
  });
});
