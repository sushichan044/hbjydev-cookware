import { pino } from "pino";

export const rootLogger = pino({ name: 'cookware' });
export const apiLogger = pino({ name: 'cookware.api' });
export const ingestLogger = pino({ name: 'cookware.ingest' });
export const authLogger = pino({ name: 'cookware.auth' });
