import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rootLogger } from "./logger.js";

const app = new Hono();

serve({
  fetch: app.fetch,
  hostname: '0.0.0.0',
  port: 8080,
}).on('listening', () => {
  rootLogger.info({ port: 8080, host: '0.0.0.0' }, 'server booted');
});
