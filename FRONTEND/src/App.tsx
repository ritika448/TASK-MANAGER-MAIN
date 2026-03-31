import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { appTheme } from "./app/theme";
import { appRouter } from "./routes";

export function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AppProviders>
        <RouterProvider router={appRouter} />
      </AppProviders>
    </ThemeProvider>
  );
}

