import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  path: "../../.env",
});

const envSchema = z.object({
  DATABASE_URL: z.string().describe("DB URL"),
});

function createEnv(env: NodeJS.ProcessEnv) {

  const safeParseResult =
    envSchema.safeParse(env);

  if (!safeParseResult.success) {
    throw new Error(
      safeParseResult.error.message
    );
  }

  return safeParseResult.data;
}

export const env =
createEnv(process.env);