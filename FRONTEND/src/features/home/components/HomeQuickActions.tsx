import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import { Button, Stack } from "@mui/material";
import { useTaskDialog } from "../../tasks/components/TaskDialogProvider";
import { useUserDialog } from "../../users/components/UserDialogProvider";

export function HomeQuickActions() {
  const { openCreateTaskDialog } = useTaskDialog();
  const { openCreateUserDialog } = useUserDialog();

  return (
    <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
      <Button
        variant="contained"
        startIcon={<AddRoundedIcon />}
        onClick={openCreateTaskDialog}
        sx={{
          px: 2.25,
          py: 1.1,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
          boxShadow: "0 10px 20px rgba(47, 65, 86, 0.2)",
          "&:hover": {
            background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
            boxShadow: "0 12px 24px rgba(47, 65, 86, 0.24)",
          },
        }}
      >
        New Task
      </Button>
      <Button
        variant="contained"
        startIcon={<PersonAddAlt1RoundedIcon />}
        onClick={openCreateUserDialog}
        sx={{
          px: 2.25,
          py: 1.1,
          borderRadius: "8px",
          background: "linear-gradient(135deg, #C8D9E6 0%, #567C8D 100%)",
          boxShadow: "0 10px 20px rgba(86, 124, 141, 0.18)",
          "&:hover": {
            background: "linear-gradient(135deg, #d7e3ec 0%, #456977 100%)",
            boxShadow: "0 12px 24px rgba(86, 124, 141, 0.22)",
          },
        }}
      >
        New Employee
      </Button>
    </Stack>
  );
}
