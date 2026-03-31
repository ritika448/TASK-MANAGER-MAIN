import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { seedLocations } from "./utils/seed-locations.js";
import { startDeadlineNotificationJob } from "./jobs/deadline-notifications.job.js";

dotenv.config();

const port = Number(process.env.PORT ?? 5002);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured.");
}

async function startServer() {
  await connectDatabase(mongoUri);
  await seedLocations();
  const app = createApp();

  app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
  });

  startDeadlineNotificationJob({
    intervalMs: Number(process.env.NOTIFICATION_DEADLINE_POLL_MS ?? 60_000),
    dueSoonWindowHours: Number(process.env.NOTIFICATION_DUE_SOON_HOURS ?? 24),
  });
}

startServer().catch((error) => {
  console.error("Failed to start backend", error);
  process.exit(1);
});
