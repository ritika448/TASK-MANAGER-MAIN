import { Task } from "../models/Task.js";
import { User } from "../models/User.js";
import { notificationHub } from "../services/notification-hub.js";

function formatTask(task) {
  return {
    id: task.id,
    taskName: task.taskName,
    description: task.description ?? "",
    assignedUsers: (task.assignedUserIds ?? []).map((user) => ({
      id: user._id ?? user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      emailId: user.emailId,
    })),
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status ?? "pending",
    completed: task.completed,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    manager: task.managerId
      ? {
          id: task.managerId._id ?? task.managerId.id ?? task.managerId,
          name: task.managerId.firstName ? `${task.managerId.firstName} ${task.managerId.lastName}`.trim() : "System",
          emailId: task.managerId.emailId,
        }
      : null,
  };
}

async function getCurrentUserRole(userId) {
  const user = await User.findById(userId);
  return user?.role ?? "manager";
}

export async function getTaskList(req, res, next) {
  try {
    const role = await getCurrentUserRole(req.userId);
    const query = role === "employee" ? { assignedUserIds: req.userId } : { managerId: req.userId };
    const tasks = await Task.find(query).populate("assignedUserIds").populate("managerId").sort({ createdAt: -1 });
    return res.status(200).json(tasks.map(formatTask));
  } catch (error) {
    return next(error);
  }
}

export async function getTaskModel(req, res, next) {
  try {
    const task = await Task.findById(req.params.id).populate("assignedUserIds").populate("managerId");
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const role = await getCurrentUserRole(req.userId);
    if (role === "employee") {
      const isAssigned = task.assignedUserIds.some((user) => {
        const userId = user._id ?? user.id ?? user;
        return String(userId) === String(req.userId);
      });
      if (!isAssigned) {
        return res.status(403).json({ message: "You can only view your assigned tasks." });
      }
    } else {
      const taskManagerId = task.managerId._id ?? task.managerId.id ?? task.managerId;
      if (String(taskManagerId) !== String(req.userId)) {
        return res.status(403).json({ message: "You can only view your managed tasks." });
      }
    }

    return res.status(200).json(formatTask(task));
  } catch (error) {
    return next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const { taskName, description = "", assignedUserIds = [], dueDate = null, priority = 1, status = "pending" } = req.body;
    if (!taskName?.trim() || !Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      return res.status(400).json({ message: "Task name and at least one assignee are required." });
    }

    const users = await User.find({ _id: { $in: assignedUserIds } });
    if (users.length !== assignedUserIds.length) {
      return res.status(400).json({ message: "One or more assignees are invalid." });
    }

    const task = await Task.create({
      taskName: taskName.trim(),
      description,
      assignedUserIds,
      managerId: req.userId,
      dueDate: dueDate || null,
      priority,
      status,
    });

    const populatedTask = await Task.findById(task.id).populate("assignedUserIds").populate("managerId");

    void notificationHub.notifyMany(assignedUserIds, {
      type: "task_assigned",
      entityType: "task",
      entityId: String(task.id),
      title: "New task assigned",
      message: `You have been assigned: ${task.taskName.trim()}`,
    });

    return res.status(201).json(formatTask(populatedTask));
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { taskName, description = "", assignedUserIds = [], dueDate = null, priority = 1, status = "pending" } = req.body;
    const completed = status === "completed";
    if (!taskName?.trim() || !Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
      return res.status(400).json({ message: "Task name and at least one assignee are required." });
    }

    const previousTask = await Task.findOne({ _id: req.params.id, managerId: req.userId })
      .select({ assignedUserIds: 1 })
      .lean();

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, managerId: req.userId },
      {
        taskName: taskName.trim(),
        description,
        assignedUserIds,
        dueDate: dueDate || null,
        priority,
        completed,
        completedByUserId: completed ? req.userId : null,
        completedOn: completed ? new Date() : null,
      },
      { new: true },
    ).populate("assignedUserIds").populate("managerId");

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const previousAssignees = new Set((previousTask?.assignedUserIds ?? []).map((id) => String(id)));
    const nextAssignees = new Set(assignedUserIds.map((id) => String(id)));
    const addedAssignees = Array.from(nextAssignees).filter((id) => !previousAssignees.has(id));

    if (addedAssignees.length > 0) {
      void notificationHub.notifyMany(addedAssignees, {
        type: "task_assigned",
        entityType: "task",
        entityId: String(task.id),
        title: "New task assigned",
        message: `You have been assigned: ${task.taskName.trim()}`,
      });
    }

    return res.status(200).json(formatTask(task));
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, managerId: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    return next(error);
  }
}
