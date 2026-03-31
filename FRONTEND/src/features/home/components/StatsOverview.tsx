import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import { Grid } from "@mui/material";
import { StatCard } from "./StatCard";

type StatsOverviewProps = {
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  activeUsers: number;
};

export function StatsOverview({
  pendingTasks,
  completedTasks,
  overdueTasks,
  activeUsers,
}: StatsOverviewProps) {
  const stats = [
    {
      label: "Pending Tasks",
      value: pendingTasks,
      icon: <AccessTimeRoundedIcon fontSize="small" />,
      iconBackground: "#fff2df",
      iconColor: "#f97316",
    },
    {
      label: "Completed Tasks",
      value: completedTasks,
      icon: <CheckCircleRoundedIcon fontSize="small" />,
      iconBackground: "#dcfce7",
      iconColor: "#16a34a",
    },
    {
      label: "Overdue Tasks",
      value: overdueTasks,
      icon: <ErrorRoundedIcon fontSize="small" />,
      iconBackground: "#fee2e2",
      iconColor: "#ef4444",
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: <GroupRoundedIcon fontSize="small" />,
      iconBackground: "#dce8ef",
      iconColor: "#567C8D",
    },
  ];

  return (
    <Grid container spacing={2.5}>
      {stats.map((item) => (
        <Grid key={item.label} size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard {...item} />
        </Grid>
      ))}
    </Grid>
  );
}
