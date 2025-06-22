// src/trpc.ts
import { initTRPC } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import type { inferAsyncReturnType } from '@trpc/server';

/**
 * Our context creator for every request.
 * Note: Express adapter will call this with a single argument
 * matching CreateExpressContextOptions.
 */
export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions) => {
  // you can pull req.session, headers, etc. in here
  return {};
};

// Derive the Context type from our createContext fn
export type Context = inferAsyncReturnType<typeof createContext>;

// Initialize tRPC with that Context
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
