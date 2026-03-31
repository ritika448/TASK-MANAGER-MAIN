import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useToast } from "./ToastProvider";

type DeleteDialogConfig = {
  title: string;
  description: string;
  confirmLabel?: string;
  successMessage?: string;
  onConfirm?: () => void | Promise<void>;
};

type DeleteConfirmContextValue = {
  openDeleteDialog: (config: DeleteDialogConfig) => void;
  closeDeleteDialog: () => void;
};

const DeleteConfirmContext = createContext<DeleteConfirmContextValue | null>(null);

export function DeleteConfirmProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DeleteDialogConfig | null>(null);
  const { showToast } = useToast();

  const closeDeleteDialog = useCallback(() => setConfig(null), []);

  const value = useMemo(
    () => ({
      openDeleteDialog: (nextConfig: DeleteDialogConfig) => setConfig(nextConfig),
      closeDeleteDialog,
    }),
    [closeDeleteDialog],
  );

  const handleConfirm = async () => {
    if (!config) {
      return;
    }

    try {
      await config.onConfirm?.();
      showToast(config.successMessage ?? "Item deleted successfully.", "success");
      setConfig(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to delete item.", "error");
    }
  };

  return (
    <DeleteConfirmContext.Provider value={value}>
      {children}

      <Dialog
        open={config !== null}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid #C8D9E6",
            background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)",
            boxShadow: "0 24px 50px rgba(47, 65, 86, 0.16)",
          },
        }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #ffe1de 0%, #ffd3cd 100%)",
                color: "#c2410c",
              }}
            >
              <WarningAmberRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#2F4156" }}>
                {config?.title}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#567C8D", mt: 0.25 }}>
                This action cannot be undone.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Typography sx={{ color: "#4b6171", lineHeight: 1.7, mb: 3 }}>
            {config?.description}
          </Typography>

          <Stack direction="row" spacing={1.25} justifyContent="flex-end">
            <Button
              onClick={closeDeleteDialog}
              sx={{
                minWidth: 168,
                borderRadius: "8px",
                color: "#567C8D",
                background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)",
                border: "1px solid #C8D9E6",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => void handleConfirm()}
              startIcon={<DeleteOutlineRoundedIcon />}
              sx={{
                minWidth: 168,
                borderRadius: "8px",
                color: "#ffffff",
                background: "linear-gradient(135deg, #df6a5f 0%, #b63e34 100%)",
                boxShadow: "0 12px 24px rgba(182, 62, 52, 0.22)",
                "&:hover": {
                  background: "linear-gradient(135deg, #e07b70 0%, #9f2f26 100%)",
                },
              }}
            >
              {config?.confirmLabel ?? "Delete"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </DeleteConfirmContext.Provider>
  );
}

export function useDeleteConfirm() {
  const context = useContext(DeleteConfirmContext);

  if (!context) {
    throw new Error("useDeleteConfirm must be used inside DeleteConfirmProvider");
  }

  return context;
}
