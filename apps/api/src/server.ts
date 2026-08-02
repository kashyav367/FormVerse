import express from "express";
import { logger } from "@repo/logger";
import cors from "cors";
import cookieParser from "cookie-parser";

import * as trpcExpress from "@trpc/server/adapters/express";
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from "trpc-to-openapi";
import { apiReference } from "@scalar/express-api-reference";

import { serverRouter, createContext } from "@repo/trpc/server";

import { env } from "./env";

export const app = express();

const openApiDocument = generateOpenApiDocument(serverRouter, {
  title: "FormVerse API Reference",
  version: "1.0.0",
  baseUrl: env.BASE_URL.concat("/api"),
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// In-Memory Rate Limiter for public endpoints
const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

app.use((req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const record = ipRequestCounts.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Too many requests. Rate limit exceeded. Please try again in a minute.",
    });
  }

  record.count++;
  return next();
});

app.get("/", (req, res) => {
  return res.json({ message: "FormVerse API is operational", status: "online" });
});

app.get("/health", (req, res) => {
  return res.json({ message: "FormVerse API server is healthy", healthy: true });
});

logger.debug(`openapi.json: ${env.BASE_URL}/openapi.json`);
app.get("/openapi.json", (req, res) => {
  return res.json(openApiDocument);
});

logger.debug(`docs: ${env.BASE_URL}/docs`);
app.use("/docs", apiReference({ url: "/openapi.json" }));

app.use(
  "/api",
  createOpenApiExpressMiddleware({
    router: serverRouter,
    createContext,
  })
);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: serverRouter,
    createContext,
  })
);

export default app;
