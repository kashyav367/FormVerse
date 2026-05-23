import { randomBytes, createHmac } from "node:crypto";
import * as jwt from "jsonwebtoken";

import { usersTable } from "@repo/database/models/user";
import { db, eq } from "@repo/database";

import {
  type CreateUserWithEmailAndPasswordInputType,
  createUserWithEmailAndPasswordInput,
  GenerateUserTokenPayloadType,
  generateUserTokenPayload,
  SignInWithEmailAndPasswordInputType,
  signInWithEmailAndPasswordInput,
} from "./model";
import { env } from "../env";

class UserService {
 private async getUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase();

  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalizedEmail));

  if (!result || result.length === 0) {
    return null;
  }

  return result[0];
}

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = jwt.sign({ id }, env.JWT_SECRET);
    return { token };
  }

  private async generateHash(salt: string, password: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationToken = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;
      return verificationToken;
    } catch (error) {
      throw new Error(`Invalid Token`);
    }
  }

  public async getUserInfoById(id: string){
    const user = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      fullName: usersTable.fullName,
      profileImageUrl: usersTable.profileImageUrl
    }).from(usersTable).where(eq(usersTable.id, id))

    if(!user || user.length === 0) throw new Error(`User with ID ${id} does not exists`)

      return user[0]!
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    const existingUserWithEmail = await this.getUserByEmail(email);
    if (existingUserWithEmail) throw new Error(`User with email ${email} already exists`);

    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(salt, password);

    const userTableResult = await db
      .insert(usersTable)
      .values({ email, fullName, password: hash, salt })
      .returning({
        id: usersTable.id,
      });

    if (!userTableResult || userTableResult.length === 0 || !userTableResult[0]?.id) {
      throw new Error(`Something went wrong while creating a user`);
    }

    const userId = userTableResult[0].id;

    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInWithEmailAndPassword(payload: SignInWithEmailAndPasswordInputType) {
    const { email, password } = await signInWithEmailAndPasswordInput.parseAsync(payload);

    const existUser = await this.getUserByEmail(email);
    if (!existUser) throw new Error(`User with email ${email} does not exists`);

    if (!existUser.password || !existUser.salt) throw new Error(`Authentication error`);

    const hash = await this.generateHash(existUser.salt, password);

    if (hash !== existUser.password) throw new Error(`Invalid email address or password`);

    const { token } = await this.generateUserToken({ id: existUser.id });

    return {
      id: existUser.id,
      token,
    };
  }

  public async verifyDecodedToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    return {
      id
    }
  }
}

export { UserService };

// Open Elementary
// Function Start line and Ending line
