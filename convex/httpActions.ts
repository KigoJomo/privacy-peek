import { httpAction } from './_generated/server';

export const health = httpAction(async () => {
  return new Response(null, {
    status: 200,
  });
});
