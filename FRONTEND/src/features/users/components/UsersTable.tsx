import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDeleteConfirm } from "../../../components/feedback/DeleteConfirmProvider";
import type { UserRecord } from "../api/users.api";
import { useUserDialog } from "./UserDialogProvider";

type UsersTableProps = {
  users: UserRecord[];
  loading?: boolean;
  onDeleteUser: (user: UserRecord) => void;
};

export function UsersTable({ users, loading = false, onDeleteUser }: UsersTableProps) {
  const { openEditUserDialog } = useUserDialog();
  const { openDeleteDialog } = useDeleteConfirm();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        background: "linear-gradient(180deg, #FEFFFF 0%, #ffffff 30%, #F5EFEB 100%)",
        boxShadow: "0 10px 26px rgba(47, 65, 86, 0.06)",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead
          sx={{
            background:
              "linear-gradient(90deg, rgba(200,217,230,0.52) 0%, rgba(245,239,235,0.88) 48%, rgba(200,217,230,0.4) 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Name</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Email</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Address</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>City</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Zip</TableCell>
            <TableCell align="right" sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                <CircularProgress size={28} />
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                <Typography sx={{ color: "#567C8D" }}>No users found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={user.profileImage || undefined} sx={{ width: 32, height: 32 }}>
                      {user.firstName.charAt(0)}
                    </Avatar>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                      {[user.firstName, user.lastName].filter(Boolean).join(" ")}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: "#4b5563" }}>{user.emailId}</TableCell>
                <TableCell sx={{ color: "#4b5563" }}>{user.address || "-"}</TableCell>
                <TableCell sx={{ color: "#4b5563" }}>
                  {[user.city, user.state, user.country].filter(Boolean).join(", ") || "-"}
                </TableCell>
                <TableCell sx={{ color: "#4b5563" }}>{user.zipCode || "-"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openEditUserDialog(user.id)} sx={{ color: "#2F4156" }}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    sx={{ color: "#ef4444" }}
                    onClick={() =>
                      openDeleteDialog({
                        title: "Delete User",
                        description: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
                        confirmLabel: "Delete User",
                        successMessage: `${user.firstName} ${user.lastName} deleted successfully.`,
                        onConfirm: () => onDeleteUser(user),
                      })
                    }
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #d9e5ec",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "#6b7280" }}>
          Showing {users.length === 0 ? 0 : 1} to {users.length} of {users.length} results
        </Typography>
        <Stack direction="row" spacing={1}>
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1.5,
              border: "1px solid #e5e7eb",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Previous
          </Box>
          <Box
            sx={{
              px: 1.1,
              py: 0.75,
              borderRadius: 1.5,
              bgcolor: "#2F4156",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            1
          </Box>
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 1.5,
              border: "1px solid #e5e7eb",
              color: "#94a3b8",
              fontSize: 13,
            }}
          >
            Next
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
