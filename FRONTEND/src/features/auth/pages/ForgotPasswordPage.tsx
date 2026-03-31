import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { Button, InputAdornment, Link, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useToast } from "../../../components/feedback/ToastProvider";
import { routePaths } from "../../../routes/route-paths";
import { authApi } from "../api/auth.api";
import { AuthPageShell } from "../components/AuthPageShell";

export function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [emailId, setEmailId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailId.trim()) {
      showToast("Please enter your email address.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authApi.forgotPassword({ emailId: emailId.trim() });
      showToast(response.message, "success");
      setEmailId("");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to send reset instructions.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Password Help"
      title="Reset your account access"
      subtitle="Enter your registered email and we will send reset instructions for your TaskFlow account."
      routeLabel={routePaths.forgotPassword}
      panelLabel="Forgot Password"
      highlights={["Email verification", "Reset guidance", "Simple recovery"]}
      footer={
        <Stack direction="row" justifyContent="center" spacing={0.75} flexWrap="wrap">
          <Typography sx={{ fontSize: 14, color: "#567C8D" }}>Remember your password?</Typography>
          <Link
            component={RouterLink}
            to={routePaths.login}
            underline="hover"
            sx={{ fontSize: 14, fontWeight: 800, color: "#2F4156" }}
          >
            Back to login
          </Link>
        </Stack>
      }
    >
      <Stack spacing={0.65}>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#2F4156" }}>Forgot Password</Typography>
        <Typography sx={{ color: "#567C8D", lineHeight: 1.65, fontSize: 14 }}>
          We will send reset instructions to your email address.
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          p: 1.1,
          borderRadius: 3,
          background: "linear-gradient(180deg, #FEFFFF 0%, #F7FBFD 100%)",
          border: "1px solid #D9E5EC",
          color: "#567C8D",
        }}
      >
        <MarkEmailReadRoundedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>A reset email will be sent if the account exists.</Typography>
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
                <AlternateEmailRoundedIcon sx={{ color: "#567C8D", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<SendRoundedIcon />}
          disabled={isSubmitting}
          sx={{
            py: 1.3,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
          }}
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </Stack>

      <Button
        component={RouterLink}
        to={routePaths.login}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ alignSelf: "flex-start", px: 0, color: "#567C8D" }}
      >
        Return to login
      </Button>
    </AuthPageShell>
  );
}
