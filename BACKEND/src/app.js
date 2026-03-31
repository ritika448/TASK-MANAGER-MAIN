import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cityRoutes from "./routes/city.routes.js";
import countryRoutes from "./routes/country.routes.js";
import currentUserRoutes from "./routes/current-user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import { requireManager } from "./middleware/role.middleware.js";
import stateRoutes from "./routes/state.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config();

export function createApp() {
  const app = express();

  const defaultClientOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
  ];
  const configuredOrigins =
    process.env.CLIENT_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];
  const allowedOrigins =
    process.env.NODE_ENV === "production" && configuredOrigins.length
      ? configuredOrigins
      : Array.from(new Set([...defaultClientOrigins, ...configuredOrigins]));

  app.use(
    cors({
      origin: allowedOrigins,
    }),
  );
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/UserManagement/Authentication", authRoutes);
  app.use("/UserManagement/User", requireAuth, requireManager, userRoutes);
  app.use("/UserManagement/CurrentUser", requireAuth, currentUserRoutes);
  app.use("/CityManagement/Country", requireAuth, requireManager, countryRoutes);
  app.use("/CityManagement/State", requireAuth, requireManager, stateRoutes);
  app.use("/CityManagement/City", requireAuth, requireManager, cityRoutes);
  app.use("/TaskManagement/Task", requireAuth, taskRoutes);
  app.use("/Notification", notificationRoutes);

  app.use(errorHandler);

  return app;
}
