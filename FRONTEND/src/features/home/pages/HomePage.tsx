import { Grid, Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useToast } from "../../../components/feedback/ToastProvider";
import { currentUserApi } from "../../users/api/current-user.api";
import { isEmployeeUser } from "../../../services/auth/auth-role";
import { usersApi } from "../../users/api/users.api";
import { useUserDialog } from "../../users/components/UserDialogProvider";
import { tasksApi, type TaskRecord } from "../../tasks/api/tasks.api";
import { useTaskDialog } from "../../tasks/components/TaskDialogProvider";
import { getTaskStatus } from "../../tasks/utils/task-ui";
import { PageReveal } from "../../../components/common/PageReveal";
import { HomeHero } from "../components/HomeHero";
import { HomeQuickActions } from "../components/HomeQuickActions";
import { MiniCalendar } from "../components/MiniCalendar";
import { RecentTasksTable } from "../components/RecentTasksTable";
import { StatsOverview } from "../components/StatsOverview";

export function HomePage() {
  if (isEmployeeUser()) {
    return <Navigate replace to="/tasks" />;
  }

  const { showToast } = useToast();
  const { refreshKey: userRefreshKey } = useUserDialog();
  const { refreshKey: taskRefreshKey } = useTaskDialog();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("User");
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [currentUser, tasksResponse, usersResponse] = await Promise.all([
          currentUserApi.getModel(),
          tasksApi.getList(),
          usersApi.getList(),
        ]);

        setFirstName(currentUser.firstName || "User");
        setTasks(tasksResponse);
        setActiveUsers(usersResponse.length);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Unable to load dashboard.", "error");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [showToast, taskRefreshKey, userRefreshKey]);

  const recentTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  const stats = useMemo(() => {
    let completedTasks = 0;
    let overdueTasks = 0;
    let pendingTasks = 0;

    tasks.forEach((task) => {
      const status = getTaskStatus(task);
      if (task.completed) {
        completedTasks += 1;
      } else if (status.label === "Overdue") {
        overdueTasks += 1;
        pendingTasks += 1;
      } else {
        pendingTasks += 1;
      }
    });

    return { pendingTasks, completedTasks, overdueTasks };
  }, [tasks]);

  return (
    <Stack spacing={3}>
      <PageReveal delay={0}>
        <HomeHero firstName={firstName} />
      </PageReveal>
      <PageReveal delay={90}>
        <StatsOverview
          pendingTasks={stats.pendingTasks}
          completedTasks={stats.completedTasks}
          overdueTasks={stats.overdueTasks}
          activeUsers={activeUsers}
        />
      </PageReveal>

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid size={{ xs: 12, xl: 8 }}>
          <PageReveal delay={180}>
            <RecentTasksTable tasks={recentTasks} loading={loading} />
          </PageReveal>
        </Grid>
        <Grid size={{ xs: 12, xl: 4 }}>
          <PageReveal delay={260}>
            <MiniCalendar tasks={tasks} />
          </PageReveal>
        </Grid>
      </Grid>

      <PageReveal delay={340}>
        <HomeQuickActions />
      </PageReveal>
    </Stack>
  );
}
