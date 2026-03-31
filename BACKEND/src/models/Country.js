import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Country = mongoose.model("Country", countrySchema);
