import {
  alpha,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import LocationCityRoundedIcon from "@mui/icons-material/LocationCityRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { NavLink, useLocation } from "react-router-dom";
import { routePaths } from "../../routes/route-paths";
import { isEmployeeUser } from "../../services/auth/auth-role";

export function Sidebar({ drawerWidth }: { drawerWidth: number }) {
  const location = useLocation();
  const isEmployee = isEmployeeUser();
  const navigation = isEmployee
    ? [
        { label: "Tasks", to: routePaths.tasks.list, icon: TaskAltRoundedIcon },
      ]
    : [
        { label: "Home", to: routePaths.home, icon: DashboardRoundedIcon },
        { label: "Users", to: routePaths.users.list, icon: GroupRoundedIcon },
        { label: "Tasks", to: routePaths.tasks.list, icon: TaskAltRoundedIcon },
        { label: "Countries", to: routePaths.countries.list, icon: PublicRoundedIcon },
        { label: "States", to: routePaths.states.list, icon: PlaceRoundedIcon },
        { label: "Cities", to: routePaths.cities.list, icon: LocationCityRoundedIcon },
        { label: "Settings", to: routePaths.settings, icon: SettingsRoundedIcon },
      ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        flexShrink: 0,
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          position: "relative",
          boxSizing: "border-box",
          width: drawerWidth,
          borderRight: "1px solid #6f8d9d",
          background:
            "linear-gradient(180deg, #2F4156 0%, #3a4f64 24%, #567C8D 58%, #7f9eaf 82%, #C8D9E6 100%)",
          px: 2,
          py: 2.5,
          boxShadow: "inset -1px 0 0 rgba(86, 124, 141, 0.6)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -20,
          left: -24,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1,
          pb: 2.5,
          borderBottom: "1px solid rgba(200, 217, 230, 0.35)",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            background: "linear-gradient(135deg, #F5EFEB 0%, #C8D9E6 100%)",
            border: "1px solid rgba(255,255,255,0.35)",
            color: "#ffffff",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 10px 18px rgba(47, 65, 86, 0.18)",
          }}
        >
          <ChecklistRoundedIcon sx={{ fontSize: 18, color: "#2F4156" }} />
        </Box>
        <Box>
          <Typography fontSize={28} fontWeight={800} letterSpacing={-0.8} color="#FEFFFF">
            TaskFlow
          </Typography>
        </Box>
      </Box>

      <List sx={{ pt: 2 }}>
        {navigation.map((item) => {
          const isActive =
            item.to === routePaths.home
              ? location.pathname === item.to
              : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={isActive}
              sx={{
                minHeight: 42,
                mb: 0.5,
                borderRadius: 2.5,
                px: 1.25,
                color: "rgba(255,255,255,0.82)",
                "&.Mui-selected": {
                  bgcolor: "rgba(245, 239, 235, 0.22)",
                  color: "#FEFFFF",
                  boxShadow: "inset 3px 0 0 #F5EFEB",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "rgba(245, 239, 235, 0.28)",
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 34,
                  color: isActive ? "#FEFFFF" : "rgba(255,255,255,0.82)",
                }}
              >
                <item.icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: isActive ? 700 : 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
