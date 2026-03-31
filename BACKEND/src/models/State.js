import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    stateName: {
      type: String,
      required: true,
      trim: true,
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
  },
  { timestamps: true },
);

stateSchema.index({ stateName: 1, countryId: 1 }, { unique: true });

export const State = mongoose.model("State", stateSchema);
