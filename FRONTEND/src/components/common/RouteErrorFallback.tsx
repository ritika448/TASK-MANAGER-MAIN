import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import { isRouteErrorResponse, Link as RouterLink, useRouteError } from "react-router-dom";
import { routePaths } from "../../routes/route-paths";

export function RouteErrorFallback() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : "Something went wrong";

  const description = isRouteErrorResponse(error)
    ? "The page could not be loaded. Please use the navigation to continue."
    : "An unexpected error happened while rendering this page.";

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}
    >
      <Paper sx={{ maxWidth: 560, width: "100%", p: 4 }}>
        <Stack spacing={2}>
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          <Alert severity="warning">{description}</Alert>
          <Typography color="text.secondary">
            If the URL is wrong or the route does not exist, go back to login or home.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={RouterLink} to={routePaths.login} variant="contained">
              Go to Login
            </Button>
            <Button component={RouterLink} to={routePaths.home} variant="outlined">
              Go to Home
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}

