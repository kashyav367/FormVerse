import { email, z } from "zod";

export const createUserWithEmailAndPasswordInputModel= z.object({
     fullName : z.string().describe("name of the user"),
     email : z.string().describe("email of the user"),
     password : z.string().describe("password of the user")

})

export const createUserWithEmailAndPasswordOutputModel = z.object({
 id: z.string().describe("id of the user created"),
})    


export const signInWithEmailAndPasswordInputModel = z.object({
     email : z.string().describe("email of the user"),
     password : z.string().describe("password of the user")

})

export const signInWithEmailAndPasswordOutputModel = z.object({
 id: z.string().describe("id of the user created"),
})    

export const getLoggedInUserInputModel = z.undefined()
export const getLoggedInUserOutputModel = z.object({
     id: z.string().describe("id of the user created"),
     email : z.string().describe("email of the user"),
     fullName : z.string().describe("name of the user"),
     profileImageUrl : z.string().describe(" image of the user").optional().nullable()
})     