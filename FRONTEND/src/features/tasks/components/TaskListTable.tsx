import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import { isEmployeeUser } from "../../../services/auth/auth-role";
import type { TaskRecord } from "../api/tasks.api";
import { useTaskDialog } from "./TaskDialogProvider";
import { formatDueDate, getPriorityStyles, getTaskStatus } from "../utils/task-ui";

type TaskListTableProps = {
  tasks: TaskRecord[];
  loading?: boolean;
  onDeleteTask: (task: TaskRecord) => void;
  onToggleCompleted: (task: TaskRecord) => void;
};

export function TaskListTable({
  tasks,
  loading = false,
  onDeleteTask,
  onToggleCompleted,
}: TaskListTableProps) {
  const { openEditTaskDialog } = useTaskDialog();
  const { openDeleteDialog } = useDeleteConfirm();
  const isEmployee = isEmployeeUser();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        background: "linear-gradient(180deg, #FEFFFF 0%, #ffffff 30%, #F5EFEB 100%)",
        boxShadow: "0 10px 26px rgba(47, 65, 86, 0.06)",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead
          sx={{
            background:
              "linear-gradient(90deg, rgba(200,217,230,0.52) 0%, rgba(245,239,235,0.88) 48%, rgba(200,217,230,0.4) 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Task Name</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Description</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Assigned To</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Due Date</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Status</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Priority</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Complete</TableCell>
            <TableCell align="right" sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                <CircularProgress size={28} />
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                <Typography sx={{ color: "#567C8D" }}>No tasks found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => {
              const status = getTaskStatus(task);
              const priority = getPriorityStyles(task.priority);
              return (
                <TableRow key={task.id} hover>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                      {task.taskName}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 190, color: "#6b7280" }}>{task.description || "-"}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar sx={{ width: 28, height: 28 }}>{task.assignedUsers[0]?.name?.charAt(0) ?? "U"}</Avatar>
                      <Typography sx={{ fontSize: 14, color: "#4b5563" }}>
                        {task.assignedUsers.map((user) => user.name).join(", ")}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "#4b5563" }}>{formatDueDate(task.dueDate)}</TableCell>
                  <TableCell>
                    <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={priority.label} size="small" sx={{ bgcolor: priority.bg, color: priority.color, fontWeight: 700 }} />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={task.completed}
                      disabled={isEmployee}
                      onChange={() => onToggleCompleted(task)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {!isEmployee ? (
                      <>
                        <IconButton onClick={() => openEditTaskDialog(task.id)} sx={{ color: "#2F4156" }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          sx={{ color: "#ef4444" }}
                          onClick={() =>
                            openDeleteDialog({
                              title: "Delete Task",
                              description: `Are you sure you want to delete ${task.taskName}?`,
                              confirmLabel: "Delete Task",
                              successMessage: `${task.taskName} deleted successfully.`,
                              onConfirm: () => onDeleteTask(task),
                            })
                          }
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>View only</Typography>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          borderTop: "1px solid #d9e5ec",
          flexWrap: "wrap",
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography sx={{ fontSize: 13, color: "#6b7280" }}>Rows per page:</Typography>
          <Box
            sx={{
              px: 1.25,
              py: 0.75,
              borderRadius: 1.5,
              border: "1px solid #e5e7eb",
              fontSize: 13,
              color: "#475569",
            }}
          >
            10
          </Box>
          <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
            Showing {tasks.length === 0 ? 0 : 1}-{tasks.length} of {tasks.length} tasks
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ color: "#94a3b8", fontSize: 16 }}>{`<`}</Typography>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1.5,
              bgcolor: "#2F4156",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            1
          </Box>
          <Typography sx={{ color: "#64748b", fontSize: 13 }}>2</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 13 }}>3</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 13 }}>...</Typography>
          <Typography sx={{ color: "#64748b", fontSize: 13 }}>10</Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 16 }}>{`>`}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
