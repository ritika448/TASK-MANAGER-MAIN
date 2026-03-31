import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    assignedUserIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    priority: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    completedOn: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
