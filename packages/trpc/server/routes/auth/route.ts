import { createUserWithEmailAndPasswordInput, signInWithEmailAndPasswordInput } from "@repo/services/user/model";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, getLoggedInUserInputModel, getLoggedInUserOutputModel, signInWithEmailAndPasswordInputModel, signInWithEmailAndPasswordOutputModel } from "./model";
import { userService } from "../../services";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";
import { set } from "zod";



const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({

  createUserWithEmailAndPassword: publicProcedure.meta({openapi:
     { method: "POST",
       path: getPath("/createUserWithEmailAndPassword"), 
       tags : TAGS 
      }})
      .input(createUserWithEmailAndPasswordInputModel)
      .output(createUserWithEmailAndPasswordOutputModel)
      .mutation( async ({input, ctx} ) => {
       const { fullName, email, password} = input

       const { id, token } = await userService.createUserWithEmailAndPassword({
        fullName, email, password
       })

       setAuthenticationCookie(ctx, token)

       return {
        id
       }
      }),

      signInWithEmailAndPassword: publicProcedure.meta(
        { openapi : {
            method : "POST",
            path : getPath("/signInWithEmailAndPassword"),
            tags : TAGS
        }}
      ).input(signInWithEmailAndPasswordInputModel).output(signInWithEmailAndPasswordOutputModel)
      .mutation(async ({ input,ctx }) => {
       const { email, password } = input
       const { id, token } = await userService.signInWithEmailAndPassword({
        email, password  
      })

      setAuthenticationCookie(ctx, token)

      return {
        id
      }
      }),


      getLoggedInUserInfo : authenticatedProcedure.meta({
        openapi : {
            method : "GET",
            path : getPath("/getLoggedInUserInfo"),
            tags : TAGS,
            protect : true
        }
      })
      .input(getLoggedInUserInputModel)
      .output(getLoggedInUserOutputModel)
      .query(async ({ ctx }) => {
        
         
         const { id, email, fullName, profileImageUrl } = await userService.getUserInfoById(ctx.user.id)   

          return {  
            id, email, fullName, profileImageUrl
          }
       })   

});
