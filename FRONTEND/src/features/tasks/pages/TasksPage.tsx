import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../../components/feedback/ToastProvider";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { usersApi } from "../../users/api/users.api";
import { tasksApi, type TaskRecord } from "../api/tasks.api";
import { TaskCard } from "../components/TaskCard";
import { TaskFilters } from "../components/TaskFilters";
import { useTaskDialog } from "../components/TaskDialogProvider";
import { TaskListTable } from "../components/TaskListTable";
import { getPriorityLabel, getTaskStatus } from "../utils/task-ui";
import { isEmployeeUser } from "../../../services/auth/auth-role";

export function TasksPage() {
  const { showToast } = useToast();
  const { refreshKey, openCreateTaskDialog } = useTaskDialog();
  const isEmployee = isEmployeeUser();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [priorityValue, setPriorityValue] = useState("");
  const [assigneeValue, setAssigneeValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      const tasksResponse = await tasksApi.getList();

      const usersResponse = isEmployee
        ? Array.from(
            new Map(
              tasksResponse
                .flatMap((task) => task.assignedUsers)
                .map((user) => [user.id, { id: user.id, name: user.name }]),
            ).values(),
          )
        : await usersApi.getLookupList();

      setTasks(tasksResponse);
      setAssigneeOptions(usersResponse);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to load tasks.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTasks();
  }, [refreshKey]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = searchValue.trim().toLowerCase();
      const status = getTaskStatus(task).label.toLowerCase();
      const priority = getPriorityLabel(task.priority).toLowerCase();
      const dueTime = task.dueDate ? new Date(task.dueDate).getTime() : null;
      const fromTime = fromDate ? new Date(fromDate).getTime() : null;
      const toTime = toDate ? new Date(toDate).getTime() : null;

      const matchesSearch =
        !query ||
        task.taskName.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.assignedUsers.some((user) => user.name.toLowerCase().includes(query));
      const matchesStatus =
        !statusValue ||
        (statusValue === "completed" ? task.completed : status.includes(statusValue.toLowerCase()));
      const matchesPriority = !priorityValue || priority === priorityValue;
      const matchesAssignee =
        !assigneeValue || task.assignedUsers.some((user) => user.id === assigneeValue);
      const matchesFromDate = fromTime === null || dueTime === null || dueTime >= fromTime;
      const matchesToDate = toTime === null || dueTime === null || dueTime <= toTime;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [assigneeValue, fromDate, priorityValue, searchValue, statusValue, tasks, toDate]);

  return (
    <Stack spacing={2.5}>
      <PageReveal delay={0}>
        <PageHeaderCard
          title="Tasks"
          description="Manage and track your tasks with a clearer, more focused workflow view."
          action={
            !isEmployee ? (
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={openCreateTaskDialog}
                sx={{
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                  boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                    boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
                  },
                }}
              >
                Add Task
              </Button>
            ) : null
          }
        />
      </PageReveal>

      <PageReveal delay={90}>
        <TaskFilters
          viewMode={viewMode}
          searchValue={searchValue}
          statusValue={statusValue}
          priorityValue={priorityValue}
          assigneeValue={assigneeValue}
          assigneeOptions={assigneeOptions}
          fromDate={fromDate}
          toDate={toDate}
          onViewChange={setViewMode}
          onSearchChange={setSearchValue}
          onStatusChange={setStatusValue}
          onPriorityChange={setPriorityValue}
          onAssigneeChange={setAssigneeValue}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </PageReveal>
      <PageReveal delay={180}>
        {viewMode === "list" ? (
          <TaskListTable
            tasks={filteredTasks}
            loading={loading}
            onDeleteTask={async (task) => {
              try {
                await tasksApi.delete(task.id);
                setTasks((current) => current.filter((currentTask) => currentTask.id !== task.id));
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Unable to delete task.", "error");
              }
            }}
            onToggleCompleted={async (task) => {
              try {
                const updatedTask = await tasksApi.update(task.id, {
                  taskName: task.taskName,
                  description: task.description,
                  assignedUserIds: task.assignedUsers.map((user) => user.id),
                  dueDate: task.dueDate,
                  priority: task.priority,
                  completed: !task.completed,
                });
                setTasks((current) =>
                  current.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask)),
                );
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Unable to update task.", "error");
              }
            }}
          />
        ) : (
          <TaskCard
            tasks={filteredTasks}
            onDeleteTask={async (task) => {
              try {
                await tasksApi.delete(task.id);
                setTasks((current) => current.filter((currentTask) => currentTask.id !== task.id));
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Unable to delete task.", "error");
              }
            }}
            onToggleCompleted={async (task) => {
              try {
                const updatedTask = await tasksApi.update(task.id, {
                  taskName: task.taskName,
                  description: task.description,
                  assignedUserIds: task.assignedUsers.map((user) => user.id),
                  dueDate: task.dueDate,
                  priority: task.priority,
                  completed: !task.completed,
                });
                setTasks((current) =>
                  current.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask)),
                );
              } catch (error) {
                showToast(error instanceof Error ? error.message : "Unable to update task.", "error");
              }
            }}
          />
        )}
      </PageReveal>
    </Stack>
  );
}
