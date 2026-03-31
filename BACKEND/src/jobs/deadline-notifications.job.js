import { Notification } from "../models/Notification.js";
import { Task } from "../models/Task.js";
import { notificationHub } from "../services/notification-hub.js";

function formatDueDate(date) {
  try {
    return new Date(date).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

async function hasNotification({ userId, taskId, type }) {
  const existing = await Notification.findOne({
    userId,
    entityType: "task",
    entityId: String(taskId),
    type,
  }).select({ _id: 1 });

  return Boolean(existing);
}

async function notifyAssigneesOnce({ userIds, task, type, title, message }) {
  const uniqueUserIds = Array.from(new Set((userIds ?? []).map((id) => String(id)))).filter(Boolean);
  if (uniqueUserIds.length === 0) {
    return;
  }

  await Promise.all(
    uniqueUserIds.map(async (userId) => {
      const alreadySent = await hasNotification({ userId, taskId: task.id, type });
      if (alreadySent) {
        return;
      }

      await notificationHub.notifyUser(userId, {
        type,
        entityType: "task",
        entityId: String(task.id),
        title,
        message,
      });
    }),
  );
}

export function startDeadlineNotificationJob({
  intervalMs = 60_000,
  dueSoonWindowHours = 24,
} = {}) {
  const dueSoonMs = Number(dueSoonWindowHours) * 60 * 60 * 1000;

  let running = false;

  const runOnce = async () => {
    if (running) {
      return;
    }
    running = true;

    try {
      const now = new Date();
      const dueSoonCutoff = new Date(now.getTime() + dueSoonMs);

      const [dueSoonTasks, overdueTasks] = await Promise.all([
        Task.find({
          completed: false,
          dueDate: { $ne: null, $gte: now, $lte: dueSoonCutoff },
        })
          .select({ taskName: 1, dueDate: 1, assignedUserIds: 1 })
          .sort({ dueDate: 1 })
          .limit(250)
          .lean(),
        Task.find({
          completed: false,
          dueDate: { $ne: null, $lt: now },
        })
          .select({ taskName: 1, dueDate: 1, assignedUserIds: 1 })
          .sort({ dueDate: -1 })
          .limit(250)
          .lean(),
      ]);

      await Promise.all([
        ...dueSoonTasks.map((task) =>
          notifyAssigneesOnce({
            userIds: task.assignedUserIds,
            task,
            type: "task_due_soon",
            title: "Task due soon",
            message: `${task.taskName} is due on ${formatDueDate(task.dueDate)}.`,
          }),
        ),
        ...overdueTasks.map((task) =>
          notifyAssigneesOnce({
            userIds: task.assignedUserIds,
            task,
            type: "task_overdue",
            title: "Task overdue",
            message: `${task.taskName} was due on ${formatDueDate(task.dueDate)}.`,
          }),
        ),
      ]);
    } catch {
      // Swallow errors to keep the interval alive; API layer has its own error handling.
    } finally {
      running = false;
    }
  };

  const timer = setInterval(() => {
    void runOnce();
  }, intervalMs);

  void runOnce();

  return () => clearInterval(timer);
}

