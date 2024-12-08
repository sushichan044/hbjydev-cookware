import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rootLogger } from "./logger.js";
import { newIngester } from "./ingest.js";
import env from "./config/env.js";
import { xrpcApp } from "./xrpc/index.js";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors({
  origin: env.CORS_ORIGINS,
  credentials: true,
}));

app.route('/xrpc', xrpcApp);

newIngester().start();
serve({
  fetch: app.fetch,
  hostname: env.HOST,
  port: env.PORT,
}).on('listening', () => {
  rootLogger.info({ port: 8080, host: '0.0.0.0' }, 'Server booted.');
});
