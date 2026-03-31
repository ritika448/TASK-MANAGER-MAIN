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
import type { LookupOption } from "../api/states.api";

type CityFormProps = {
  open: boolean;
  mode?: "create" | "edit";
  initialValue?: {
    cityName: string;
    stateId: string;
    zipCodes: string[];
  };
  stateOptions: LookupOption[];
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: { cityName: string; stateId: string; zipCodes: string[] }) => Promise<void> | void;
};

export function CityForm({
  open,
  mode = "create",
  initialValue,
  stateOptions,
  isSubmitting = false,
  onClose,
  onSubmit,
}: CityFormProps) {
  const isEdit = mode === "edit";
  const [cityName, setCityName] = useState("");
  const [stateId, setStateId] = useState("");
  const [zipCodesText, setZipCodesText] = useState("");

  useEffect(() => {
    if (open) {
      setCityName(initialValue?.cityName ?? "");
      setStateId(initialValue?.stateId ?? "");
      setZipCodesText((initialValue?.zipCodes ?? []).join(", "));
    }
  }, [initialValue, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
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
          {isEdit ? "Edit City" : "New City"}
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
            const zipCodes = zipCodesText
              .split(/[\n,]+/)
              .map((zipCode) => zipCode.trim())
              .filter(Boolean);
            await onSubmit({ cityName, stateId, zipCodes });
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="City Name*"
              placeholder="Enter city name"
              value={cityName}
              onChange={(event) => setCityName(event.target.value)}
            />
            <Typography sx={{ mt: 0.75, fontSize: 11, color: "#9ca3af" }}>
              Maximum 50 characters
            </Typography>
          </Box>

          <FormControl fullWidth>
            <InputLabel>State*</InputLabel>
            <Select
              value={stateId}
              label="State*"
              onChange={(event) => setStateId(event.target.value)}
              displayEmpty
              renderValue={(value) => (value ? stateOptions.find((option) => option.id === value)?.name ?? value : "Select a state")}
            >
              <MenuItem value="">Select a state</MenuItem>
              {stateOptions.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Zip Code(s)(Optional)"
              placeholder="Enter zip codes separated by commas or new lines"
              value={zipCodesText}
              onChange={(event) => setZipCodesText(event.target.value)}
            />
            <Typography sx={{ mt: 0.75, fontSize: 11, color: "#9ca3af", lineHeight: 1.5 }}>
              Enter multiple zip codes separated by commas or new lines. Maximum 6 characters per
              zip code.
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
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Save City"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
