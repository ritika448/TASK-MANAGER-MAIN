import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileDialog } from "../../features/users/components/ProfileDialogProvider";
import { authStorage } from "../../services/auth/auth-storage";
import { routePaths } from "../../routes/route-paths";
import { useNotifications } from "../../features/notifications/components/NotificationProvider";

export function Header() {
  const navigate = useNavigate();
  const { openProfileDialog } = useProfileDialog();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const currentUser = authStorage.getUser();
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const openProfileMenu = (event: MouseEvent<HTMLElement>) => {
    setProfileAnchor(event.currentTarget);
  };

  const openNotificationMenu = (event: MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
    void markAllRead();
  };

  const closeProfileMenu = () => {
    setProfileAnchor(null);
  };

  const closeNotificationMenu = () => {
    setNotificationAnchor(null);
  };

  const goToProfile = () => {
    closeProfileMenu();
    openProfileDialog();
  };

  const handleLogout = () => {
    closeProfileMenu();
    authStorage.clear();
    navigate(routePaths.login);
  };

  return (
    <>
      <AppBar
        color="inherit"
        elevation={0}
        position="static"
        sx={{
          height: 84,
          borderBottom: "1px solid #c8d9e6",
          background:
            "linear-gradient(180deg, rgba(254,255,255,0.96) 0%, rgba(245,239,235,0.92) 52%, rgba(200,217,230,0.34) 100%)",
          backdropFilter: "blur(18px)",
          boxShadow: "0 12px 32px rgba(47, 65, 86, 0.08)",
        }}
      >
        <Toolbar
          sx={{
            height: 84,
            minHeight: "84px !important",
            px: { xs: 2, md: 3 },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Paper
            component="form"
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: 420,
              height: 44,
              px: 1.75,
              bgcolor: "#FEFFFF",
              border: "1px solid #C8D9E6",
              borderRadius: 3,
              boxShadow: "0 1px 2px rgba(47, 65, 86, 0.06)",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#567C8D",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 24px rgba(86, 124, 141, 0.12)",
              },
              "&:focus-within": {
                borderColor: "#567C8D",
                bgcolor: "#ffffff",
                boxShadow: "0 0 0 4px rgba(86, 124, 141, 0.14), 0 12px 26px rgba(47, 65, 86, 0.08)",
              },
            }}
          >
            <SearchRoundedIcon sx={{ color: "#567C8D", fontSize: 20, mr: 1.25 }} />
            <InputBase
              placeholder="Search tasks, users..."
              sx={{
                flex: 1,
                color: "#2F4156",
                fontSize: 14,
                "& input::placeholder": {
                  color: "#7a98a8",
                  opacity: 1,
                },
              }}
            />
          </Paper>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              onClick={openNotificationMenu}
              sx={{
                width: 46,
                height: 46,
                color: "#567C8D",
                border: "1px solid #C8D9E6",
                bgcolor: "#ffffff",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#2F4156",
                  borderColor: "#567C8D",
                  bgcolor: alpha("#567C8D", 0.08),
                },
              }}
            >
              <Badge badgeContent={unreadCount > 0 ? unreadCount : undefined} color="error" overlap="circular">
                <NotificationsNoneRoundedIcon fontSize="small" />
              </Badge>
            </IconButton>

            <Box
              onClick={openProfileMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.1,
                px: 1.1,
                py: 0.75,
                borderRadius: 99,
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(200, 217, 230, 0.24)",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                  color: "#FEFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {currentUser?.firstName?.charAt(0) ?? "U"}
              </Avatar>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#2F4156",
                  whiteSpace: "nowrap",
                }}
              >
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "User"}
              </Typography>
              <KeyboardArrowDownRoundedIcon sx={{ color: "#567C8D", fontSize: 22 }} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={closeNotificationMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            width: 380,
            maxWidth: "calc(100vw - 32px)",
            borderRadius: 3,
            border: "1px solid #C8D9E6",
            boxShadow: "0 18px 40px rgba(47, 65, 86, 0.12)",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #C8D9E6", background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)" }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#2F4156" }}>Notifications</Typography>
        </Box>
        <Box sx={{ p: 1.25 }}>
          {notifications.length === 0 ? (
            <Box sx={{ py: 3.5, px: 1.25 }}>
              <Typography sx={{ fontSize: 13, color: "#567C8D", textAlign: "center" }}>
                No notifications yet.
              </Typography>
            </Box>
          ) : (
            notifications.slice(0, 8).map((notification, index) => (
              <MenuItem
                key={notification.id}
                onClick={closeNotificationMenu}
                sx={{
                  px: 1.25,
                  py: 1.25,
                  mb: index === Math.min(notifications.length, 8) - 1 ? 0 : 0.75,
                  borderRadius: 2.5,
                  alignItems: "flex-start",
                  gap: 1.25,
                  bgcolor: notification.read ? "transparent" : alpha("#C8D9E6", 0.26),
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, mt: 0.25 }}>
                  <NotificationsRoundedIcon
                    fontSize="small"
                    sx={{ color: notification.read ? "#567C8D" : "#2F4156" }}
                  />
                </ListItemIcon>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#2F4156", mb: 0.25 }}>
                    {notification.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#567C8D",
                      lineHeight: 1.5,
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {notification.message}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Box>
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={closeProfileMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            minWidth: 190,
            borderRadius: 3,
            border: "1px solid #C8D9E6",
            boxShadow: "0 18px 40px rgba(47, 65, 86, 0.12)",
          },
        }}
      >
        <MenuItem onClick={goToProfile} sx={{ py: 1.2 }}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.2, color: "#dc2626" }}>
          <ListItemIcon sx={{ color: "#dc2626" }}>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </>
  );
}
