import type { CorsOptions } from "cors";

export function createCorsOptions(
  origins = process.env.CORS_ORIGINS,
  environment = process.env.NODE_ENV,
): CorsOptions {
  const allowedOrigins = (origins ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (allowedOrigins.length === 0) {
    if (environment === "production") {
      throw new Error("Configure CORS_ORIGINS com as URLs dos frontends");
    }
    allowedOrigins.push("http://localhost:5173", "http://localhost:5174");
  }

  for (const origin of allowedOrigins) {
    const url = new URL(origin);
    if (!["http:", "https:"].includes(url.protocol) || url.origin !== origin) {
      throw new Error(`Origem CORS inválida: ${origin}`);
    }
  }

  return {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}
