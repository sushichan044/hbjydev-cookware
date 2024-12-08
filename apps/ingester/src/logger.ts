import { pino } from "pino";

export const rootLogger = pino({ name: 'cookware' });
export const ingestLogger = pino({ name: 'cookware.ingest' });
