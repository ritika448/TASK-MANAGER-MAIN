import type { TaskRecord } from "../api/tasks.api";

export function getPriorityLabel(priority: number) {
  if (priority === 2) {
    return "High";
  }
  if (priority === 0) {
    return "Low";
  }
  return "Medium";
}

export function getPriorityStyles(priority: number) {
  if (priority === 2) {
    return { label: "High", bg: "#fee2e2", color: "#dc2626" };
  }
  if (priority === 0) {
    return { label: "Low", bg: "#dcfce7", color: "#16a34a" };
  }
  return { label: "Medium", bg: "#fef3c7", color: "#d97706" };
}

export function getTaskStatus(task: TaskRecord) {
  if (task.completed) {
    return { label: "Completed", bg: "#dcfce7", color: "#16a34a" };
  }

  if (!task.dueDate) {
    return { label: "Pending", bg: "#dbeafe", color: "#2563eb" };
  }

  const dueDate = new Date(task.dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const diffDays = Math.round((dueDay.getTime() - startOfToday.getTime()) / 86400000);

  if (diffDays < 0) {
    return { label: "Overdue", bg: "#fee2e2", color: "#dc2626" };
  }
  if (diffDays === 0) {
    return { label: "Today", bg: "#dbeafe", color: "#2563eb" };
  }
  if (diffDays === 1) {
    return { label: "Tomorrow", bg: "#ffedd5", color: "#ea580c" };
  }

  return {
    label: `Due ${dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
    bg: "#dcfce7",
    color: "#16a34a",
  };
}

export function formatDueDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
