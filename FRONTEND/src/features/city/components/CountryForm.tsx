import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

type CountryFormProps = {
  open: boolean;
  mode?: "create" | "edit";
  initialValue?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { countryName: string }) => Promise<void> | void;
};

export function CountryForm({
  open,
  mode = "create",
  initialValue = "",
  isSubmitting = false,
  onClose,
  onSubmit,
}: CountryFormProps) {
  const isEdit = mode === "edit";
  const [countryName, setCountryName] = useState(initialValue);

  useEffect(() => {
    if (open) {
      setCountryName(initialValue);
    }
  }, [initialValue, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.75,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#2F4156" }}>
          {isEdit ? "Edit Country" : "New Country"}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack
          spacing={2.25}
          component="form"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit({ countryName });
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="Country Name*"
              placeholder="Enter country name"
              value={countryName}
              onChange={(event) => setCountryName(event.target.value)}
            />
            <Typography sx={{ mt: 0.75, fontSize: 11, color: "#9ca3af", textAlign: "right" }}>
              {countryName.length}/50
            </Typography>
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ pt: 1 }}>
            <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              disabled={isSubmitting}
              sx={{
                borderRadius: "8px",
                px: 2.25,
                background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
                "&:hover": {
                  background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                  boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
                },
              }}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
