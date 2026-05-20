import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { createCookiesFactory, getCookieFactory, clearCookieFactory } from "./utils/cookie";

export interface TRPCCtxUser {
  id: string
}

export interface TRPCContext {
  createCookie: ReturnType<typeof createCookiesFactory>;
  getCookie: ReturnType<typeof getCookieFactory>;
  clearCookie: ReturnType<typeof clearCookieFactory>;

  user?: TRPCCtxUser
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<TRPCContext> {

    const ctx: TRPCContext = {
        createCookie: createCookiesFactory(res),
        getCookie: getCookieFactory(req),
        clearCookie: clearCookieFactory(res),
        user: undefined
    }

  return ctx;
}
export type Context = Awaited<ReturnType<typeof createContext>>;
