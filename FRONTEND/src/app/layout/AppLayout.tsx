import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { Sidebar } from "../../components/layout/Sidebar";

const drawerWidth = 250;

export function AppLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        background:
          "radial-gradient(circle at top left, rgba(86, 124, 141, 0.12), transparent 18%), linear-gradient(180deg, #feffff 0%, #f8fbfd 52%, #f5efeb 100%)",
      }}
    >
      <Sidebar drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <Box
          className="page-shell"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
