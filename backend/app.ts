import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, pageNotFound } from "./middlewares/error.js";

import orderRoutes from "./routes/order.routes.js";
import authRoutes from "./routes/auth.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";

const normalizeOrigin = (origin: string): string => origin.replace(/\/$/, "");

const getAllowedOrigins = (): string[] => {
  const origins = [
    process.env.DEVELOPMENT_CLIENT_ORIGIN,
    process.env.PRODUCTION_CLIENT_ORIGIN,
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeOrigin);

  return origins.length > 0 ? origins : ["http://localhost:3000"];
};

const isLocalDevOrigin = (origin: string): boolean =>
  /^https?:\/\/localhost(:\d+)?$/.test(origin);

const isServerlessRuntime = (): boolean =>
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);

export const createApp = () => {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
          callback(null, true);
          return;
        }
        if (process.env.NODE_ENV === "development" && isLocalDevOrigin(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
      methods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    })
  );

  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
  }

  app.use(express.json());

  if (!isServerlessRuntime()) {
    try {
      const uploadsDir = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "uploads"
      );
      app.use("/uploads", express.static(uploadsDir));
    } catch {
      // import.meta.url is unavailable in bundled serverless builds
    }
  }

  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payment", paymentRoutes);

  app.get("/", (_req, res) => {
    res.send("SiliconBazaar API is running");
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "siliconbazaar-api" });
  });

  app.use(pageNotFound);
  app.use(errorHandler);

  return app;
};
