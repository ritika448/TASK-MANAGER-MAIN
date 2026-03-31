import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    zipCode: {
      type: String,
      trim: true,
      default: "",
    },
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      default: null,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      default: null,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      default: null,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["manager", "employee"],
      default: "manager",
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
