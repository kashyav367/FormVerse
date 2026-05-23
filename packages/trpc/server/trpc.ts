import { initTRPC } from "@trpc/server";
import { createContext } from "./context";
import { userService } from "./services";
import { getAuthenticationCookie } from "./utils/cookie";

export const tRPCContext = initTRPC
  .meta()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

export const authenticatedProcedure =
  tRPCContext.procedure.use(async (options) => {
    const { ctx } = options;

    const userToken = getAuthenticationCookie(ctx);

    if (!userToken) {
      throw new Error("User is not logged in");
    }

    const { id } =
      await userService.verifyDecodedToken(userToken);

    return options.next({
      ctx: {
        ...ctx,
        user: {
          id,
        },
      },
    });
  });