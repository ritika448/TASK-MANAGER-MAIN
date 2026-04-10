import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { SettingsSectionCard } from "../components/SettingsSectionCard";
import { settingsApi } from "../api/settings.api";
import { useToast } from "../../../components/feedback/ToastProvider";
import type { UserRecord } from "../../users/api/users.api";

export function SettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserRecord | null>(null);
  const [form, setForm] = useState({
    workspaceName: "",
    timezone: "",
    defaultTaskPriority: "",
    defaultTaskView: "",
    emailNotifications: true,
    dueDateReminders: true,
    weeklySummary: false,
    pushNotifications: true,
    currentPassword: "",
    newPassword: "",
    twoFactorEnabled: false,
    multiSessionSignOut: true,
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        setLoading(true);
        const userData = await settingsApi.getCurrentSettings();
        setUser(userData);
        setForm({
          workspaceName: userData.workspaceName ?? "TaskFlow Workspace",
          timezone: userData.timezone ?? "asia-kolkata",
          defaultTaskPriority: userData.defaultTaskPriority ?? "medium",
          defaultTaskView: userData.defaultTaskView ?? "list",
          emailNotifications: userData.notificationSettings?.email ?? true,
          dueDateReminders: userData.notificationSettings?.dueDates ?? true,
          weeklySummary: userData.notificationSettings?.weeklySummary ?? false,
          pushNotifications: userData.notificationSettings?.push ?? true,
          currentPassword: "",
          newPassword: "",
          twoFactorEnabled: userData.appearanceSettings?.twoFactorEnabled ?? false,
          multiSessionSignOut: userData.appearanceSettings?.multiSessionSignOut ?? true,
        });
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Unable to load settings.", "error");
      } finally {
        setLoading(false);
      }
    }
    void fetchSettings();
  }, [showToast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: Partial<UserRecord> = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailId: user?.emailId,
        workspaceName: form.workspaceName,
        timezone: form.timezone,
        defaultTaskPriority: form.defaultTaskPriority,
        defaultTaskView: form.defaultTaskView,
        notificationSettings: {
          email: form.emailNotifications,
          dueDates: form.dueDateReminders,
          weeklySummary: form.weeklySummary,
          push: form.pushNotifications,
        },
        appearanceSettings: {
          theme: user?.appearanceSettings?.theme ?? "light",
          secureSession: user?.appearanceSettings?.secureSession ?? true,
          twoFactorEnabled: form.twoFactorEnabled,
          multiSessionSignOut: form.multiSessionSignOut,
        },
      };

      if (form.newPassword) {
        if (!form.currentPassword) {
          showToast("Current password is required to set a new password.", "warning");
          setSaving(false);
          return;
        }
        (payload as any).password = form.newPassword;
        (payload as any).updatePassword = true;
      }

      await settingsApi.updateSettings(payload);
      showToast("Workspace settings updated successfully.", "success");
      setForm((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to save settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress color="info" />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <PageReveal delay={0}>
        <PageHeaderCard
          title="Settings"
          description="Manage your workspace preferences, notifications, and security settings in a more refined layout."
        />
      </PageReveal>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Stack spacing={2.5}>
            <PageReveal delay={90}>
              <SettingsSectionCard
                title="Workspace Preferences"
                description="Update your workspace name, timezone, and default task preferences."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Workspace Name"
                      value={form.workspaceName}
                      onChange={(e) => setForm({ ...form, workspaceName: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="timezone-label">Timezone</InputLabel>
                      <Select
                        labelId="timezone-label"
                        value={form.timezone}
                        label="Timezone"
                        onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                      >
                        <MenuItem value="asia-kolkata">Asia/Kolkata</MenuItem>
                        <MenuItem value="utc">UTC</MenuItem>
                        <MenuItem value="america-new-york">America/New_York</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="priority-label">Default Task Priority</InputLabel>
                      <Select
                        labelId="priority-label"
                        value={form.defaultTaskPriority}
                        label="Default Task Priority"
                        onChange={(e) => setForm({ ...form, defaultTaskPriority: e.target.value })}
                      >
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="view-label">Task View</InputLabel>
                      <Select
                        labelId="view-label"
                        value={form.defaultTaskView}
                        label="Task View"
                        onChange={(e) => setForm({ ...form, defaultTaskView: e.target.value })}
                      >
                        <MenuItem value="list">List View</MenuItem>
                        <MenuItem value="card">Card View</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </SettingsSectionCard>
            </PageReveal>

            <PageReveal delay={170}>
              <SettingsSectionCard
                title="Notifications"
                description="Control how and when your team receives updates."
              >
                <Stack spacing={1.25}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.emailNotifications}
                        onChange={(e) => setForm({ ...form, emailNotifications: e.target.checked })}
                        color="info"
                      />
                    }
                    label="Email notifications for assigned tasks"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.dueDateReminders}
                        onChange={(e) => setForm({ ...form, dueDateReminders: e.target.checked })}
                        color="info"
                      />
                    }
                    label="Due date reminders"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.weeklySummary}
                        onChange={(e) => setForm({ ...form, weeklySummary: e.target.checked })}
                        color="info"
                      />
                    }
                    label="Weekly workspace summary"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.pushNotifications}
                        onChange={(e) => setForm({ ...form, pushNotifications: e.target.checked })}
                        color="info"
                      />
                    }
                    label="Browser push notifications"
                  />
                </Stack>
              </SettingsSectionCard>
            </PageReveal>

            <PageReveal delay={250}>
              <SettingsSectionCard
                title="Security"
                description="Manage session and access-related settings for your account."
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      value={form.currentPassword}
                      onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.twoFactorEnabled}
                          onChange={(e) => setForm({ ...form, twoFactorEnabled: e.target.checked })}
                          color="info"
                        />
                      }
                      label="Enable two-factor authentication"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.multiSessionSignOut}
                          onChange={(e) => setForm({ ...form, multiSessionSignOut: e.target.checked })}
                          color="info"
                        />
                      }
                      label="Sign out from other active sessions"
                    />
                  </Grid>
                </Grid>
              </SettingsSectionCard>
            </PageReveal>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Stack spacing={2.5}>
            <PageReveal delay={130}>
              <SettingsSectionCard
                title="Profile Snapshot"
                description="Quick overview of your active account and workspace role."
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={user?.profileImage}
                    sx={{ width: 52, height: 52, bgcolor: "#567C8D", color: "#FEFFFF" }}
                  >
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </Avatar>
                  <Stack spacing={0.25}>
                    <Typography sx={{ fontWeight: 700, color: "#111827" }}>
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: "#6b7280", textTransform: "capitalize" }}>
                      {user?.role} Administrator
                    </Typography>
                  </Stack>
                </Stack>
              </SettingsSectionCard>
            </PageReveal>

            <PageReveal delay={210}>
              <SettingsSectionCard
                title="Appearance"
                description="Keep the interface aligned with your team workflow."
              >
                <Stack spacing={1.25}>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <TuneRoundedIcon sx={{ color: "#567C8D" }} />
                    <Typography sx={{ color: "#475569" }}>Light theme enabled</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.25} alignItems="center">
                    <SecurityRoundedIcon sx={{ color: "#567C8D" }} />
                    <Typography sx={{ color: "#475569" }}>Secure session active</Typography>
                  </Stack>
                </Stack>
              </SettingsSectionCard>
            </PageReveal>

            <PageReveal delay={290}>
              <Button
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveRoundedIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: "8px",
                  px: 2.5,
                  py: 1.2,
                  background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                  boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                    boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
                  },
                }}
              >
                {saving ? "Saving Changes..." : "Save Settings"}
              </Button>
            </PageReveal>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

