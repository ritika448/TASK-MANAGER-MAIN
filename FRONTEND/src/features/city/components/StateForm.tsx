import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { LookupOption } from "../api/countries.api";

type StateFormProps = {
  open: boolean;
  mode?: "create" | "edit";
  initialValue?: {
    stateName: string;
    countryId: string;
  };
  countryOptions: LookupOption[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { stateName: string; countryId: string }) => Promise<void> | void;
};

export function StateForm({
  open,
  mode = "create",
  initialValue,
  countryOptions,
  isSubmitting = false,
  onClose,
  onSubmit,
}: StateFormProps) {
  const isEdit = mode === "edit";
  const [stateName, setStateName] = useState("");
  const [countryId, setCountryId] = useState("");

  useEffect(() => {
    if (open) {
      setStateName(initialValue?.stateName ?? "");
      setCountryId(initialValue?.countryId ?? "");
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
          {isEdit ? "Edit State" : "New State"}
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
            await onSubmit({ stateName, countryId });
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="State Name*"
              placeholder="Enter state name"
              value={stateName}
              onChange={(event) => setStateName(event.target.value)}
            />
            <Typography sx={{ mt: 0.75, fontSize: 11, color: "#9ca3af" }}>
              Maximum 50 characters
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Country*</InputLabel>
            <Select
              value={countryId}
              label="Country*"
              onChange={(event) => setCountryId(event.target.value)}
              displayEmpty
              renderValue={(value) => (value ? countryOptions.find((option) => option.id === value)?.name ?? value : "Select a country")}
            >
              <MenuItem value="">Select a country</MenuItem>
              {countryOptions.map((country) => (
                <MenuItem key={country.id} value={country.id}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
