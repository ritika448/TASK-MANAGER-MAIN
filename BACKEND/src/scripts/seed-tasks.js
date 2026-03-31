import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured.");
}

const taskSeeds = [
  {
    taskName: "Prepare weekly sprint summary",
    description: "Compile sprint progress, blockers, and completed work for the manager review.",
    priority: 1,
    completed: false,
    dueDateOffsetDays: 2,
  },
  {
    taskName: "Update onboarding checklist",
    description: "Refresh employee onboarding steps and verify account access details.",
    priority: 0,
    completed: false,
    dueDateOffsetDays: 4,
  },
  {
    taskName: "Review pending UI feedback",
    description: "Check recent UI comments and convert approved feedback into action items.",
    priority: 2,
    completed: false,
    dueDateOffsetDays: 1,
  },
  {
    taskName: "Clean task assignment records",
    description: "Validate assigned employees and remove duplicate task entries from the tracker.",
    priority: 1,
    completed: true,
    dueDateOffsetDays: -1,
  },
  {
    taskName: "Plan next release tasks",
    description: "Create the initial list of features, owners, and due dates for the upcoming release.",
    priority: 2,
    completed: false,
    dueDateOffsetDays: 6,
  },
];

function getDueDate(offsetDays) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return date;
}

async function run() {
  await connectDatabase(mongoUri);

  const manager = await User.findOne({ role: "manager" }).sort({ createdAt: 1 });
  if (!manager) {
    throw new Error("No manager found. Create a manager account first.");
  }

  const employees = await User.find({ managerId: manager._id, role: "employee" }).sort({ createdAt: 1 });
  if (employees.length === 0) {
    throw new Error("No employees found for the manager. Create at least one employee first.");
  }

  let createdCount = 0;

  for (let index = 0; index < taskSeeds.length; index += 1) {
    const seed = taskSeeds[index];
    const assignedUsers = [employees[index % employees.length]._id];

    if (employees.length > 1 && index % 2 === 0) {
      const secondAssignee = employees[(index + 1) % employees.length]._id;
      if (String(secondAssignee) !== String(assignedUsers[0])) {
        assignedUsers.push(secondAssignee);
      }
    }

    const duplicate = await Task.findOne({
      managerId: manager._id,
      taskName: seed.taskName,
    });

    if (duplicate) {
      continue;
    }

    await Task.create({
      taskName: seed.taskName,
      description: seed.description,
      assignedUserIds: assignedUsers,
      managerId: manager._id,
      dueDate: getDueDate(seed.dueDateOffsetDays),
      priority: seed.priority,
      completed: seed.completed,
      completedByUserId: seed.completed ? assignedUsers[0] : null,
      completedOn: seed.completed ? new Date() : null,
    });

    createdCount += 1;
  }

  console.log(`Task seed completed. Added ${createdCount} task(s).`);
  await mongoose.connection.close();
}

run().catch((error) => {
  console.error("Failed to seed tasks", error);
  process.exit(1);
});
