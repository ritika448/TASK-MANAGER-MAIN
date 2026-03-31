import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
      trim: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    zipCodes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

citySchema.index({ cityName: 1, stateId: 1 }, { unique: true });

export const City = mongoose.model("City", citySchema);
