import { initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";
import { userService } from "./services";
import { getAuthenticationCookie } from "./utils/cookie";

export const tRPCContext = initTRPC
  .meta()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure = tRPCContext.procedure.use(async (options) => {
  const { ctx } = options;

  const userToken = getAuthenticationCookie(ctx);

  if (!userToken) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not logged in",
    });
  }

  try {
    const { id } = await userService.verifyDecodedToken(userToken);

    return options.next({
      ctx: {
        ...ctx,
        user: {
          id,
        },
      },
    });
  } catch (error) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session expired or invalid authentication token",
    });
  }
});