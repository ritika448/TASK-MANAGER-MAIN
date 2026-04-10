import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import { useToast } from "../../../components/feedback/ToastProvider";
import { usersApi } from "../../users/api/users.api";
import { tasksApi, type TaskRecord } from "../api/tasks.api";

type TaskDialogContextValue = {
  openCreateTaskDialog: () => void;
  openEditTaskDialog: (taskId: string) => void;
  closeTaskDialog: () => void;
  refreshKey: number;
};

const TaskDialogContext = createContext<TaskDialogContextValue | null>(null);

export function TaskDialogProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const { openDeleteDialog } = useDeleteConfirm();
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userOptions, setUserOptions] = useState<Array<{ id: string; name: string }>>([]);
  const [task, setTask] = useState<TaskRecord | null>(null);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUserIds, setAssignedUserIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState("pending");
  const [completed, setCompleted] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const applyVisualFormat = useCallback((command: string, value: string | undefined = undefined) => {
    if (descriptionRef.current) {
      descriptionRef.current.focus();
    }
    document.execCommand(command, false, value);
    // Sync state after formatting
    if (descriptionRef.current) {
      setDescription(descriptionRef.current.innerHTML);
    }
  }, []);

  const handleDuplicate = useCallback(() => {
    setTask(null);
    setSelectedTaskId(null);
    setMode("create");
    // Preserve the current description but in create mode
    if (descriptionRef.current) {
      // The state 'description' already has the content, but we ensure the div is synced
      descriptionRef.current.innerHTML = description;
    }
    showToast("Task details duplicated. You can now save it as a new task.", "info");
  }, [description, showToast]);

  const handleSetReminder = useCallback(() => {
    showToast("Reminder functionality is coming soon!", "info");
  }, [showToast]);

  const handleLink = useCallback(() => {
    const url = prompt("Enter the URL:");
    if (url) {
      applyVisualFormat("createLink", url);
    }
  }, [applyVisualFormat]);

  useEffect(() => {
    async function loadDialogData() {
      if (!mode) {
        return;
      }

      try {
        setLoading(true);
        const [users, taskModel] = await Promise.all([
          usersApi.getLookupList(),
          mode === "edit" && selectedTaskId ? tasksApi.getModel(selectedTaskId) : Promise.resolve(null),
        ]);

        setUserOptions(users);
        setTask(taskModel);
        setTaskName(taskModel?.taskName ?? "");
        setDescription(taskModel?.description ?? "");
        if (descriptionRef.current) {
          descriptionRef.current.innerHTML = taskModel?.description ?? "";
        }
        setAssignedUserIds(taskModel?.assignedUsers.map((user) => user.id) ?? []);
        setDueDate(taskModel?.dueDate ? taskModel.dueDate.slice(0, 10) : "");
        setPriority(taskModel?.priority ?? 1);
        setStatus(taskModel?.status ?? "pending");
        setCompleted(taskModel?.completed ?? false);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Unable to open task dialog.", "error");
        setMode(null);
      } finally {
        setLoading(false);
      }
    }

    void loadDialogData();
  }, [mode, selectedTaskId, showToast]);

  // Special effect to sync visual editor when dialog opens and data is ready
  useEffect(() => {
    if (mode === "edit" && task && descriptionRef.current) {
      if (descriptionRef.current.innerHTML !== task.description) {
        descriptionRef.current.innerHTML = task.description;
      }
    } else if (mode === "create" && descriptionRef.current) {
      descriptionRef.current.innerHTML = "";
    }
  }, [mode, task]);

  const value = useMemo(
    () => ({
      openCreateTaskDialog: () => {
        setTask(null);
        setTaskName("");
        setDescription("");
        setAssignedUserIds([]);
        setDueDate("");
        setPriority(1);
        setStatus("pending");
        setCompleted(false);
        setSelectedTaskId(null);
        setMode("create");
      },
      openEditTaskDialog: (taskId: string) => {
        setSelectedTaskId(taskId);
        setMode("edit");
      },
      closeTaskDialog: () => setMode(null),
      refreshKey,
    }),
    [refreshKey],
  );

  const selectedAssigneeNames = userOptions.filter((user) => assignedUserIds.includes(user.id));

  async function handleSubmit() {
    if (!taskName.trim() || assignedUserIds.length === 0) {
      showToast("Task name and at least one assignee are required.", "warning");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        taskName: taskName.trim(),
        description: description.trim(),
        assignedUserIds,
        dueDate: dueDate || null,
        priority,
        status,
      };

      if (mode === "edit" && selectedTaskId) {
        await tasksApi.update(selectedTaskId, payload);
        showToast("Task updated successfully.", "success");
      } else {
        await tasksApi.create(payload);
        showToast("Task created successfully.", "success");
      }

      setMode(null);
      setRefreshKey((current) => current + 1);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to save task.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <TaskDialogContext.Provider value={value}>
      {children}
      <Dialog
        open={mode !== null}
        onClose={() => setMode(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            maxWidth: 980,
          },
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography sx={{ fontSize: 30, fontWeight: 800, color: "#2F4156" }}>
            {mode === "edit" ? "Edit Task" : "New Task"}
          </Typography>
          <IconButton onClick={() => setMode(null)}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Grid container>
            <Grid size={{ xs: 12, md: 7.5 }}>
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <TextField
                      fullWidth
                      label="Task Name *"
                      placeholder="Enter task name..."
                      value={taskName}
                      onChange={(event) => setTaskName(event.target.value)}
                    />
                    <Typography sx={{ mt: 0.75, fontSize: 12, color: "#9ca3af" }}>
                      {taskName.length}/50
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 700, color: "#475569" }}>
                      Description
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        border: "1px solid #dbe4ee",
                        borderRadius: 2.5,
                        overflow: "hidden",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                          px: 1.5,
                          py: 1,
                          borderBottom: "1px solid #e5e7eb",
                          color: "#64748b",
                        }}
                      >
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyVisualFormat("bold");
                          }}
                          sx={{ fontWeight: 700, cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          B
                        </Typography>
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyVisualFormat("italic");
                          }}
                          sx={{ fontStyle: "italic", cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          I
                        </Typography>
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyVisualFormat("underline");
                          }}
                          sx={{ textDecoration: "underline", cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          U
                        </Typography>
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyVisualFormat("insertUnorderedList");
                          }}
                          sx={{ cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          •
                        </Typography>
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyVisualFormat("insertOrderedList");
                          }}
                          sx={{ cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          ≡
                        </Typography>
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            applyVisualFormat("strikeThrough");
                          }}
                          sx={{ cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          -
                        </Typography>
                        <Typography
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleLink();
                          }}
                          sx={{ cursor: "pointer", "&:hover": { color: "#2F4156" } }}
                        >
                          🔗
                        </Typography>
                      </Stack>
                      <Box sx={{ p: 1.5 }}>
                        <Box
                          contentEditable
                          ref={descriptionRef}
                          onInput={(e) => setDescription(e.currentTarget.innerHTML)}
                          onBlur={(e) => setDescription(e.currentTarget.innerHTML)}
                          sx={{
                            minHeight: 120,
                            outline: "none",
                            fontSize: 14,
                            color: "#1e293b",
                            "&:empty:before": {
                              content: '"Describe the task details..."',
                              color: "#94a3b8",
                            },
                            "& ul": { pl: 2, my: 1 },
                            "& ol": { pl: 2, my: 1 },
                          }}
                        />
                      </Box>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 700, color: "#475569" }}>
                      Assigned To *
                    </Typography>
                    <FormControl fullWidth>
                      <InputLabel>Assignees</InputLabel>
                      <Select
                        multiple
                        value={assignedUserIds}
                        label="Assignees"
                        onChange={(event) => setAssignedUserIds(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value)}
                        renderValue={(selected) => (
                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            {(selected as string[]).map((id) => {
                              const user = userOptions.find((option) => option.id === id);
                              return (
                                <Chip
                                  key={id}
                                  label={user?.name ?? id}
                                  sx={{ bgcolor: "#edf4f8", color: "#2F4156", fontWeight: 600 }}
                                />
                              );
                            })}
                          </Stack>
                        )}
                      >
                        {userOptions.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Stack spacing={1}>
                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#475569" }}>
                          Priority
                        </Typography>
                        <Stack direction="row" spacing={1.25} flexWrap="wrap">
                          {[
                            { value: 0, label: "Low", border: "#86efac", bg: "#ffffff" },
                            { value: 1, label: "Medium", border: "#fb923c", bg: "#fff7ed" },
                            { value: 2, label: "High", border: "#fca5a5", bg: "#ffffff" },
                          ].map((option) => (
                            <Chip
                              key={option.value}
                              label={option.label}
                              onClick={() => setPriority(option.value)}
                              sx={{
                                border: `${priority === option.value ? 2 : 1}px solid ${option.border}`,
                                bgcolor: option.bg,
                                fontWeight: priority === option.value ? 700 : 500,
                              }}
                            />
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Stack>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 4.5 }}>
              <Box sx={{ p: 3, borderLeft: { md: "1px solid #e5e7eb" }, height: "100%" }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 700, color: "#475569" }}>
                      Status
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {[
                        { value: "pending", label: "Pending", color: "#64748b", bg: "#f1f5f9" },
                        { value: "in_progress", label: "In Progress", color: "#3b82f6", bg: "#eff6ff" },
                        { value: "completed", label: "Completed", color: "#10b981", bg: "#ecfdf5" },
                        { value: "overdue", label: "Overdue", color: "#ef4444", bg: "#fef2f2" },
                      ].map((opt) => (
                        <Chip
                          key={opt.value}
                          label={opt.label}
                          onClick={() => setStatus(opt.value)}
                          sx={{
                            bgcolor: status === opt.value ? opt.bg : "transparent",
                            color: status === opt.value ? opt.color : "#94a3b8",
                            border: `1px solid ${status === opt.value ? opt.color : "#e2e8f0"}`,
                            fontWeight: status === opt.value ? 700 : 500,
                            "&:hover": {
                              bgcolor: opt.bg,
                              borderColor: opt.color,
                              opacity: 0.8,
                            },
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Box>
                    <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 700, color: "#475569" }}>
                      Details
                    </Typography>
                    <Paper elevation={0} sx={{ p: 1.75, border: "1px solid #e5e7eb", borderRadius: 2.5 }}>
                      <Stack spacing={1.25}>
                        <DetailRow
                          label="Created"
                          value={task?.createdAt ? new Date(task.createdAt).toLocaleDateString() : "Pending save"}
                        />
                        <DetailRow
                          label="Created By"
                          value={task?.manager?.name ?? "You"}
                          isAvatar
                        />
                        <DetailRow
                          label="Last Updated"
                          value={task?.updatedAt ? new Date(task.updatedAt).toLocaleDateString() : "Not saved yet"}
                        />
                        <DetailRow
                          label="Assignees"
                          value={selectedAssigneeNames.length ? `${selectedAssigneeNames.length} selected` : "None"}
                          accent
                        />
                      </Stack>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography sx={{ mb: 1, fontSize: 14, fontWeight: 700, color: "#475569" }}>
                      Quick Actions
                    </Typography>
                    <Stack spacing={1}>
                      <QuickAction
                        icon={<ContentCopyRoundedIcon fontSize="small" />}
                        label="Duplicate Task"
                        onClick={handleDuplicate}
                      />
                      <QuickAction
                        icon={<NotificationsActiveRoundedIcon fontSize="small" />}
                        label="Set Reminder"
                        onClick={handleSetReminder}
                      />
                      {mode === "edit" && selectedTaskId ? (
                        <QuickAction
                          icon={<DeleteOutlineRoundedIcon fontSize="small" />}
                          label="Delete Task"
                          danger
                          onClick={() =>
                            openDeleteDialog({
                              title: "Delete Task",
                              description: "Are you sure you want to delete this task from the popup?",
                              confirmLabel: "Delete Task",
                              successMessage: "Task deleted successfully.",
                              onConfirm: async () => {
                                await tasksApi.delete(selectedTaskId);
                                setMode(null);
                                setRefreshKey((current) => current + 1);
                              },
                            })
                          }
                        />
                      ) : null}
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <Button onClick={() => setMode(null)} sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              disabled={loading || saving}
              onClick={() => void handleSubmit()}
              sx={{
                borderRadius: "8px",
                px: 2.5,
                background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                  boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
                },
              }}
            >
              {saving ? "Saving..." : "Save Task"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </TaskDialogContext.Provider>
  );
}

function DetailRow({
  label,
  value,
  accent = false,
  isAvatar = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  isAvatar?: boolean;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontSize: 14, color: "#64748b" }}>{label}</Typography>
      <Stack direction="row" spacing={0.75} alignItems="center">
        {isAvatar ? (
          <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#C8D9E6" }} />
        ) : null}
        <Typography
          sx={{
            fontSize: 14,
            color: accent ? "#2F4156" : "#41576a",
            fontWeight: accent ? 700 : 600,
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  );
}

function QuickAction({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      sx={{
        px: 1.5,
        py: 1.25,
        border: "1px solid #e5e7eb",
        borderRadius: 2.5,
        color: danger ? "#ef4444" : "#64748b",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              borderColor: danger ? "#f3b4ad" : "#C8D9E6",
              transform: "translateY(-1px)",
              boxShadow: "0 10px 20px rgba(47, 65, 86, 0.08)",
            }
          : undefined,
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center">
        {icon}
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{label}</Typography>
      </Stack>
    </Paper>
  );
}

export function useTaskDialog() {
  const context = useContext(TaskDialogContext);

  if (!context) {
    throw new Error("useTaskDialog must be used inside TaskDialogProvider");
  }

  return context;
}
