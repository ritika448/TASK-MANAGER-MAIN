import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Chip,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { UserLocationLookups, UserUpsertPayload } from "../api/users.api";

type UserFormProps = {
  mode: "create" | "edit";
  initialValues?: Partial<UserUpsertPayload>;
  lookups: UserLocationLookups;
  isSubmitting?: boolean;
  onSubmit: (payload: UserUpsertPayload) => Promise<void> | void;
  onCancel?: () => void;
};

export function UserForm({
  mode,
  initialValues,
  lookups,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const isEdit = mode === "edit";
  const [changePassword, setChangePassword] = useState(!isEdit);
  const [form, setForm] = useState<UserUpsertPayload>({
    firstName: "",
    lastName: "",
    emailId: "",
    address: "",
    zipCode: "",
    country: "",
    state: "",
    city: "",
    password: "",
    updatePassword: !isEdit,
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setForm({
      firstName: initialValues?.firstName ?? "",
      lastName: initialValues?.lastName ?? "",
      emailId: initialValues?.emailId ?? "",
      address: initialValues?.address ?? "",
      zipCode: initialValues?.zipCode ?? "",
      country: initialValues?.country ?? "",
      state: initialValues?.state ?? "",
      city: initialValues?.city ?? "",
      password: "",
      updatePassword: !isEdit,
    });
    setConfirmPassword("");
    setChangePassword(!isEdit);
  }, [initialValues, isEdit]);

  const filteredStates = useMemo(
    () =>
      form.country
        ? lookups.states.filter((state) => state.countryId === form.country)
        : [],
    [form.country, lookups.states],
  );

  const filteredCities = useMemo(
    () =>
      form.state ? lookups.cities.filter((city) => city.stateId === form.state) : [],
    [form.state, lookups.cities],
  );

  const selectedCountryName =
    lookups.countries.find((country) => country.id === form.country)?.name ?? "";
  const selectedStateName =
    lookups.states.find((state) => state.id === form.state)?.name ?? "";
  const selectedCityName =
    lookups.cities.find((city) => city.id === form.city)?.name ?? "";
  const headingTitle = isEdit ? "Edit Employee Account" : "Create Employee Account";
  const headingDescription = isEdit
    ? "Update employee details, access information, and location mapping."
    : "Create a real employee login with email and password so they can sign in and see only their assigned tasks.";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: "1px solid rgba(86, 124, 141, 0.14)",
        bgcolor: "#ffffff",
        background: "linear-gradient(180deg, rgba(254,255,255,0.98) 0%, rgba(245,239,235,0.72) 100%)",
      }}
    >
      <Stack
        spacing={3}
        component="form"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSubmit({
            ...form,
            country: selectedCountryName || form.country,
            state: selectedStateName || form.state,
            city: selectedCityName || form.city,
            password: changePassword ? form.password : undefined,
            updatePassword: changePassword,
          });
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25, flexWrap: "wrap" }}>
              <Chip
                size="small"
                label="Employee Role"
                sx={{
                  borderRadius: "8px",
                  bgcolor: "rgba(200, 217, 230, 0.75)",
                  color: "#2F4156",
                  fontWeight: 800,
                }}
              />
              <Chip
                size="small"
                icon={<BadgeRoundedIcon sx={{ fontSize: 16 }} />}
                label="Manager-created account"
                sx={{
                  borderRadius: "8px",
                  bgcolor: "rgba(245, 239, 235, 0.92)",
                  color: "#567C8D",
                  fontWeight: 700,
                }}
              />
            </Stack>
            <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>
              {headingTitle}
            </Typography>
            <Typography sx={{ fontSize: 15, color: "#6b7280" }}>
              {headingDescription}
            </Typography>
          </Box>

          <Stack alignItems="center" spacing={1}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#C8D9E6",
                  color: "#2F4156",
                  border: "1px solid #9fb6c6",
                }}
              >
                <AddAPhotoRoundedIcon />
              </Avatar>
            </Box>
            <Typography sx={{ fontSize: 12, color: "#2F4156", fontWeight: 700 }}>
              {isEdit ? "Update Image" : "Upload Photo"}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                border: "1px solid rgba(86, 124, 141, 0.14)",
                background: "linear-gradient(135deg, rgba(200, 217, 230, 0.34) 0%, rgba(254,255,255,0.96) 100%)",
              }}
            >
              <Stack spacing={0.5}>
                <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#2F4156" }}>
                  Login ID for employee
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#567C8D" }}>
                  The employee will sign in using the email address you enter below.
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 1.75,
                borderRadius: 2.5,
                border: "1px solid rgba(86, 124, 141, 0.14)",
                background: "linear-gradient(135deg, rgba(245, 239, 235, 0.9) 0%, rgba(254,255,255,0.98) 100%)",
              }}
            >
              <Stack direction="row" spacing={1.25} alignItems="center">
                <LockRoundedIcon sx={{ color: "#567C8D", fontSize: 18 }} />
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#2F4156" }}>
                    Password access
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#567C8D" }}>
                    {isEdit
                      ? "Enable password update only when you want to reset this employee account."
                      : "Set a password here and share these credentials securely with the employee."}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="First Name *"
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Last Name *"
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email Address *"
              value={form.emailId}
              onChange={(event) => setForm((current) => ({ ...current, emailId: event.target.value }))}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address"
              value={form.address}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={form.country}
                label="Country"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    country: event.target.value,
                    state: "",
                    city: "",
                  }))
                }
                displayEmpty
                renderValue={(value) =>
                  value ? lookups.countries.find((country) => country.id === value)?.name ?? value : "Select Country"
                }
              >
                <MenuItem value="">Select Country</MenuItem>
                {lookups.countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select
                value={form.state}
                label="State"
                disabled={!form.country}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    state: event.target.value,
                    city: "",
                  }))
                }
                displayEmpty
                renderValue={(value) =>
                  value ? filteredStates.find((state) => state.id === value)?.name ?? value : "Select State"
                }
              >
                <MenuItem value="">Select State</MenuItem>
                {filteredStates.map((state) => (
                  <MenuItem key={state.id} value={state.id}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={form.city}
                label="City"
                disabled={!form.state}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                displayEmpty
                renderValue={(value) =>
                  value ? filteredCities.find((city) => city.id === value)?.name ?? value : "Select City"
                }
              >
                <MenuItem value="">Select City</MenuItem>
                {filteredCities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Zip Code"
              value={form.zipCode}
              onChange={(event) => setForm((current) => ({ ...current, zipCode: event.target.value }))}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={changePassword}
                  onChange={(event) => {
                    setChangePassword(event.target.checked);
                    setForm((current) => ({
                      ...current,
                      password: "",
                      updatePassword: event.target.checked,
                    }));
                    setConfirmPassword("");
                  }}
                />
              }
              label="Change Password"
            />
          </Grid>

          {changePassword ? (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password *"
                  value={form.password ?? ""}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password *"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </Grid>
            </>
          ) : null}
        </Grid>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              minWidth: 168,
              borderRadius: "8px",
              borderColor: "#cbd5e1",
              color: "#475569",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            disabled={isSubmitting}
            sx={{
              minWidth: 168,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
              boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
              },
            }}
          >
            {isSubmitting ? "Saving..." : isEdit ? "Save Employee" : "Create Employee"}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
