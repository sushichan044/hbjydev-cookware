import { Hono } from 'hono';

export const xrpcApp = new Hono();

xrpcApp.use('/:nsid', async c => {
  c.status(400);
  return c.json({
    error: 'not_implemented',
    message: 'The XRPC server has not yet been implemented.',
  });
});
