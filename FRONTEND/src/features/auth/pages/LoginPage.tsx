import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, ReactNode, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/feedback/ToastProvider";
import { authStorage } from "../../../services/auth/auth-storage";
import { routePaths } from "../../../routes/route-paths";
import { authApi } from "../api/auth.api";
import { AuthPageShell } from "../components/AuthPageShell";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailId.trim() || !password.trim()) {
      showToast("Please fill in email and password.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authApi.login({
        emailId: emailId.trim(),
        password,
        rememberMe,
      });

      authStorage.setToken(response.authToken, rememberMe);
      authStorage.setUser(response.user, rememberMe);
      showToast(`Welcome back, ${response.user.firstName}!`, "success");
      navigate(
        response.user.role === "employee"
          ? routePaths.tasks.list
          : location.state?.from?.pathname ?? routePaths.home,
      );
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to login.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Welcome Back"
      title="Sign in to your workspace"
      subtitle="Access your dashboard, manage tasks, and continue collaborating with your team from one secure workspace."
      routeLabel="/login"
      panelLabel="Secure Login"
      highlights={["Secure access", "Remember me", "Clean workflow", "API ready"]}
      footer={
        <Stack direction="row" justifyContent="center" spacing={0.75} flexWrap="wrap">
          <Typography sx={{ fontSize: 14, color: "#567C8D" }}>Don't have an account?</Typography>
          <Link
            component={RouterLink}
            to={routePaths.signup}
            underline="hover"
            sx={{ fontSize: 14, fontWeight: 800, color: "#2F4156" }}
          >
            Create account
          </Link>
        </Stack>
      }
    >
      <Stack spacing={0.65}>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#2F4156" }}>Login</Typography>
        <Typography sx={{ color: "#567C8D", lineHeight: 1.65, fontSize: 14 }}>
          Welcome back. Enter your credentials to continue to TaskFlow.
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        flexWrap="wrap"
        sx={{
          p: 1,
          borderRadius: 3,
          border: "1px solid #D9E5EC",
          background: "linear-gradient(180deg, #FEFFFF 0%, #F7FBFD 100%)",
        }}
      >
        <ChipLike icon={<SecurityRoundedIcon sx={{ fontSize: 16 }} />} label="256-bit secure session" />
        <ChipLike label="Fast dashboard access" />
      </Stack>

      <Stack component="form" spacing={1.8} onSubmit={handleSubmit}>
        <TextField
          fullWidth
          value={emailId}
          onChange={(event) => setEmailId(event.target.value)}
          label="Email Address"
          placeholder="sarah.johnson@email.com"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineRoundedIcon sx={{ color: "#567C8D", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          label="Password"
          placeholder="Enter your password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <LockRoundedIcon sx={{ color: "#567C8D", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
            }
            label={<Typography sx={{ fontSize: 14.5, color: "#567C8D" }}>Remember me</Typography>}
          />
          <Link
            component={RouterLink}
            to={routePaths.forgotPassword}
            underline="hover"
            sx={{ color: "#2F4156", fontWeight: 700, cursor: "pointer", fontSize: 14.5 }}
          >
            Forgot Password?
          </Link>
        </Stack>

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<ArrowForwardRoundedIcon />}
          disabled={isSubmitting}
          sx={{
            py: 1.45,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
            boxShadow: "0 16px 34px rgba(47, 65, 86, 0.2)",
            "&:hover": {
              background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
            },
          }}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </Stack>

      <Box>
        <Divider sx={{ mb: 2, color: "#7f96a5", fontSize: 13 }}>Quick Preview</Divider>
        <Stack
          spacing={1.25}
          sx={{
            p: 1.6,
            borderRadius: 3,
            border: "1px solid #C8D9E6",
            background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)",
          }}
        >
          <Typography sx={{ fontSize: 14, color: "#2F4156", fontWeight: 800 }}>
            Demo Credentials
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "#567C8D" }}>
            Email: demo@taskflow.com
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: "#567C8D" }}>
            Password: password123
          </Typography>
        </Stack>
      </Box>
    </AuthPageShell>
  );
}

function ChipLike({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.8}
      alignItems="center"
      sx={{
        px: 1.1,
        py: 0.8,
        borderRadius: 99,
        bgcolor: "#ffffff",
        border: "1px solid #D9E5EC",
        color: "#567C8D",
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 12.5, fontWeight: 700 }}>{label}</Typography>
    </Stack>
  );
}
