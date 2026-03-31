import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { seedLocations } from "../utils/seed-locations.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured.");
}

async function run() {
  await connectDatabase(mongoUri);
  await seedLocations();
  console.log("Location seed completed.");
  await mongoose.connection.close();
}

run().catch((error) => {
  console.error("Failed to seed locations", error);
  process.exit(1);
});
