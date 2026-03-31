import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import "../models/Country.js";
import "../models/State.js";
import "../models/City.js";
import { User } from "../models/User.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured.");
}

function isObjectIdLike(value) {
  return typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);
}

async function run() {
  await connectDatabase(mongoUri);

  const users = await User.find()
    .populate("countryId")
    .populate("stateId")
    .populate("cityId");

  let updatedCount = 0;

  for (const user of users) {
    let changed = false;

    if (user.countryId?.countryName && (!user.country || isObjectIdLike(user.country))) {
      user.country = user.countryId.countryName;
      changed = true;
    }

    if (user.stateId?.stateName && (!user.state || isObjectIdLike(user.state))) {
      user.state = user.stateId.stateName;
      changed = true;
    }

    if (user.cityId?.cityName && (!user.city || isObjectIdLike(user.city))) {
      user.city = user.cityId.cityName;
      changed = true;
    }

    if (changed) {
      await user.save();
      updatedCount += 1;
    }
  }

  console.log(`User location repair completed. Updated ${updatedCount} user(s).`);
  await mongoose.connection.close();
}

run().catch((error) => {
  console.error("Failed to repair user locations", error);
  process.exit(1);
});
