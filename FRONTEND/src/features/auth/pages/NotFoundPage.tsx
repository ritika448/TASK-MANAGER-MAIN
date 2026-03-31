import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { routePaths } from "../../../routes/route-paths";

export function NotFoundPage() {
  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Stack spacing={2}>
        <Typography variant="h3" fontWeight={700}>
          404
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          Page not found
        </Typography>
        <Typography color="text.secondary">
          Jo route aap open kar rahe ho woh app me configured nahi hai.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button component={RouterLink} to={routePaths.login} variant="contained">
            Back to Login
          </Button>
          <Button component={RouterLink} to={routePaths.home} variant="outlined">
            Open Home
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
