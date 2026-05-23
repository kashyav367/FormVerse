import { userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { setAuthenticationCookie } from "../../utils/cookie";
import { generatePath } from "../../utils/path-generator";
import {
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  getLoggedInUserInfoInputModel,
  getLoggedInUserInfoOutput,
  signInUserWithEmailAndPasswordInputModel,
  signInUserWithEmailAndPasswordOutputModel,
} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, fullName, password } = input;
      const { id, token } = await userService.createUserWithEmailAndPassword({
        email,
        fullName,
        password,
      });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

  signInUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/signInUserWithEmailAndPassword"),
        tags: TAGS,
      },
    })
    .input(signInUserWithEmailAndPasswordInputModel)
    .output(signInUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;

      const { id, token } = await userService.signInWithEmailAndPassword({ email, password });

      setAuthenticationCookie(ctx, token);

      return {
        id,
      };
    }),

getLoggedInUserInfo: authenticatedProcedure
  .meta({
    openapi: {
      method: "GET",
      path: getPath("/getLoggedInUserInfo"),
      tags: TAGS,
      protect: true,
    },
  })
  .input(getLoggedInUserInfoInputModel)
  .output(getLoggedInUserInfoOutput)
  .query(async ({ ctx }) => {
    const { id, email, fullName, profileImageUrl } =
      await userService.getUserInfoById(ctx.user?.id);

    return {
      id,
      email,
      fullName,
      profileImageUrl,
    };
  }),
}); 
