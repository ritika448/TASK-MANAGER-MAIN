import {
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { TaskRecord } from "../../tasks/api/tasks.api";
import { formatDueDate, getPriorityStyles, getTaskStatus } from "../../tasks/utils/task-ui";

type RecentTasksTableProps = {
  tasks: TaskRecord[];
  loading?: boolean;
};

export function RecentTasksTable({ tasks, loading = false }: RecentTasksTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        overflow: "hidden",
        background: "linear-gradient(180deg, #FEFFFF 0%, #ffffff 20%, #F5EFEB 100%)",
        boxShadow: "0 10px 26px rgba(47, 65, 86, 0.06)",
      }}
    >
      <Stack
        sx={{
          px: 2.5,
          py: 2.25,
          borderBottom: "1px solid #C8D9E6",
          background: "linear-gradient(90deg, rgba(200, 217, 230, 0.45), rgba(245,239,235,0.45))",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>
          Recent Tasks
        </Typography>
      </Stack>

      <Table>
        <TableHead
          sx={{
            background:
              "linear-gradient(90deg, rgba(200,217,230,0.52) 0%, rgba(245,239,235,0.88) 48%, rgba(200,217,230,0.4) 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Task Name</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Due Date</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Priority</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                <CircularProgress size={28} />
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                <Typography sx={{ color: "#567C8D" }}>No recent tasks available.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const priority = getPriorityStyles(task.priority);
              const status = getTaskStatus(task);

              return (
                <TableRow key={task.id}>
                  <TableCell sx={{ fontWeight: 600, color: "#374151" }}>{task.taskName}</TableCell>
                  <TableCell sx={{ color: "#6b7280" }}>{formatDueDate(task.dueDate)}</TableCell>
                  <TableCell>
                    <Chip
                      label={priority.label}
                      size="small"
                      sx={{
                        bgcolor: priority.bg,
                        color: priority.color,
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: status.bg,
                        color: status.color,
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
