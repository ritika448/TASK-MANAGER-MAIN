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
} from "@mui/material";
import { PageHeaderCard } from "../../../components/common/PageHeaderCard";
import { PageReveal } from "../../../components/common/PageReveal";
import { SettingsSectionCard } from "../components/SettingsSectionCard";

export function SettingsPage() {
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
                  <TextField fullWidth label="Workspace Name" defaultValue="TaskFlow Workspace" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select defaultValue="asia-kolkata" label="Timezone">
                      <MenuItem value="asia-kolkata">Asia/Kolkata</MenuItem>
                      <MenuItem value="utc">UTC</MenuItem>
                      <MenuItem value="america-new-york">America/New_York</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Default Task Priority</InputLabel>
                    <Select defaultValue="medium" label="Default Task Priority">
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Task View</InputLabel>
                    <Select defaultValue="list" label="Task View">
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
                  control={<Switch defaultChecked color="info" />}
                  label="Email notifications for assigned tasks"
                />
                <FormControlLabel
                  control={<Switch defaultChecked color="info" />}
                  label="Due date reminders"
                />
                <FormControlLabel
                  control={<Switch color="info" />}
                  label="Weekly workspace summary"
                />
                <FormControlLabel
                  control={<Switch defaultChecked color="info" />}
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
                  <TextField fullWidth type="password" label="Current Password" />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth type="password" label="New Password" />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked color="info" />}
                    label="Enable two-factor authentication"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked color="info" />}
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
                <Avatar sx={{ width: 52, height: 52, bgcolor: "#567C8D", color: "#FEFFFF" }}>
                  SJ
                </Avatar>
                <Stack spacing={0.25}>
                  <Typography sx={{ fontWeight: 700, color: "#111827" }}>Sarah Johnson</Typography>
                  <Typography sx={{ fontSize: 14, color: "#6b7280" }}>Project Administrator</Typography>
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
                startIcon={<SaveRoundedIcon />}
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
                Save Settings
              </Button>
            </PageReveal>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
