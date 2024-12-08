import { z } from "zod";

const envSchema = z.object({
  TURSO_CONNECTION_URL: z.string().default('https://turso.dev.hayden.moe'),
  TURSO_AUTH_TOKEN: z.string().or(z.undefined()),

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
