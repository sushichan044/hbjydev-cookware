import { Jetstream } from "@skyware/jetstream";
import { WebSocket } from "ws";
import { ingestLogger } from "./logger.js";
import env from "./config/env.js";

export const newIngester = () => {
  const jetstream = new Jetstream({
    ws: WebSocket,
    endpoint: env.JETSTREAM_ENDPOINT,
    wantedCollections: ['moe.hayden.cookware.*'],
    cursor: 0,
  });

  jetstream.onCreate("moe.hayden.cookware.recipe", event => {
    ingestLogger.info(`New post: ${event.commit.record.title} (${event.commit.rkey})`);
  });

  jetstream.onUpdate("moe.hayden.cookware.recipe", event => {
    ingestLogger.info(`Updated post: ${event.commit.record.title} (${event.commit.rkey})`);
  });

  jetstream.on('open', () => {
    ingestLogger.info({
      endpoint: env.JETSTREAM_ENDPOINT,
      wantedCollections: ['moe.hayden.cookware.*'],
    }, 'Ingester connection opened.');
  });

  jetstream.on('close', () => {
    ingestLogger.error('Ingester connection closed.');
  });

  jetstream.on('error', err => {
    ingestLogger.error({ err }, 'Ingester runtime error.');
  });

  return jetstream;
};
