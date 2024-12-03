import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().lte(65535).default(8080),
  HOST: z.string().ip().default('0.0.0.0'),

  TURSO_CONNECTION_URL: z.string().default('https://turso.dev.hayden.moe'),
  TURSO_AUTH_TOKEN: z.string().nullish(),

  JETSTREAM_ENDPOINT: z
    .string()
    .url()
    .default('wss://jetstream1.us-east.bsky.network/subscribe'),
  PLC_DIRECTORY_URL: z.string().url().default('https://plc.directory'),

  ENV: z
    .union([
      z.literal('development'),
      z.literal('production'),
    ])
    .default('development'),
});

const env = envSchema.parse(process.env);

export default env;
export type Env = z.infer<typeof envSchema>;
