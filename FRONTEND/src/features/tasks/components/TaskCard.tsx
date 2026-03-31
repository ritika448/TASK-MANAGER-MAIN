import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import { isEmployeeUser } from "../../../services/auth/auth-role";
import type { TaskRecord } from "../api/tasks.api";
import { useTaskDialog } from "./TaskDialogProvider";
import { getPriorityStyles, getTaskStatus } from "../utils/task-ui";

type TaskCardProps = {
  tasks: TaskRecord[];
  onDeleteTask: (task: TaskRecord) => void;
  onToggleCompleted: (task: TaskRecord) => void;
};

export function TaskCard({ tasks, onDeleteTask, onToggleCompleted }: TaskCardProps) {
  const { openEditTaskDialog } = useTaskDialog();
  const { openDeleteDialog } = useDeleteConfirm();
  const isEmployee = isEmployeeUser();

  return (
    <Stack spacing={2}>
      {tasks.map((task) => {
        const status = getTaskStatus(task);
        const priority = getPriorityStyles(task.priority);
        return (
          <Paper
            key={task.id}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #C8D9E6",
              background: "linear-gradient(135deg, #FEFFFF 0%, #F5EFEB 100%)",
              boxShadow: "0 10px 24px rgba(47, 65, 86, 0.06)",
            }}
          >
            <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1f2937", mb: 1 }}>
                  {task.taskName}
                </Typography>
                <Typography sx={{ maxWidth: 620, fontSize: 14, color: "#6b7280" }}>
                  {task.description || "-"}
                </Typography>
              </Box>

              <Stack spacing={1} sx={{ minWidth: { md: 220 } }}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>Assigned:</Typography>
                  <Stack direction="row" spacing={-0.75}>
                    {task.assignedUsers.slice(0, 2).map((user) => (
                      <Avatar key={user.id} sx={{ width: 24, height: 24, border: "2px solid #fff" }}>
                        {user.name.charAt(0)}
                      </Avatar>
                    ))}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>Due:</Typography>
                  <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, fontWeight: 700 }} />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>Priority:</Typography>
                  <Chip label={priority.label} size="small" sx={{ bgcolor: priority.bg, color: priority.color, fontWeight: 700 }} />
                </Stack>

                <Stack direction="row" spacing={1.25} alignItems="center" justifyContent="flex-end">
                  <Switch
                    checked={task.completed}
                    color="info"
                    disabled={isEmployee}
                    onChange={() => onToggleCompleted(task)}
                  />
                  {!isEmployee ? (
                    <>
                      <IconButton onClick={() => openEditTaskDialog(task.id)} sx={{ color: "#64748b" }}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        sx={{ color: "#64748b" }}
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
                  ) : null}
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
