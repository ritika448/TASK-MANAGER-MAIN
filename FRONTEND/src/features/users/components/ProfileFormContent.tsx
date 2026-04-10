import CameraAltRoundedIcon from "@mui/icons-material/CameraAltRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { UserLocationLookups, UserUpsertPayload } from "../api/users.api";

type ProfileFormContentProps = {
  compact?: boolean;
  loading?: boolean;
  initialValues?: Partial<UserUpsertPayload>;
  lookups: UserLocationLookups;
  managerInfo?: {
    name: string;
    email: string;
  } | null;
  onSubmit: (payload: UserUpsertPayload) => Promise<void> | void;
  onCancel?: () => void;
};

export function ProfileFormContent({
  compact = false,
  loading = false,
  initialValues,
  lookups,
  managerInfo = null,
  onSubmit,
  onCancel,
}: ProfileFormContentProps) {
  const [changePassword, setChangePassword] = useState(false);
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
    updatePassword: false,
  });

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
      updatePassword: false,
    });
    setChangePassword(false);
  }, [initialValues]);

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

  return (
    <>
      <Box
        sx={{
          px: { xs: 2.5, md: compact ? 3 : 3.5 },
          py: compact ? 2.25 : 2.75,
          background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
          color: "#ffffff",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ position: "relative", width: "fit-content" }}>
            <Avatar
              alt="Profile"
              sx={{
                width: compact ? 52 : 56,
                height: compact ? 52 : 56,
                border: "3px solid rgba(255,255,255,0.8)",
              }}
            >
              {form.firstName.charAt(0) || "U"}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                right: -2,
                bottom: -2,
                width: 22,
                height: 22,
                borderRadius: "50%",
                bgcolor: "#ffffff",
                color: "#2F4156",
                display: "grid",
                placeItems: "center",
              }}
            >
              <CameraAltRoundedIcon sx={{ fontSize: 14 }} />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: compact ? 24 : 28, fontWeight: 700, lineHeight: 1.1 }}>
              My Profile
            </Typography>
            <Typography sx={{ fontSize: 14, opacity: 0.92 }}>
              Manage your account settings
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: { xs: 2.5, md: compact ? 3 : 3.5 } }}>
        <Grid
          container
          spacing={2.5}
          component="form"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit({
              ...form,
              country: selectedCountryName,
              state: selectedStateName,
              city: selectedCityName,
              password: changePassword ? form.password : undefined,
              updatePassword: changePassword,
            });
          }}
        >
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="First Name *"
              value={form.firstName}
              helperText="Max 50 characters"
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Last Name *"
              value={form.lastName}
              helperText="Max 50 characters"
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
              helperText="Max 100 characters"
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="profile-country-label">Country</InputLabel>
              <Select
                labelId="profile-country-label"
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
              >
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
              <InputLabel id="profile-state-label">State</InputLabel>
              <Select
                labelId="profile-state-label"
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
              >
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
              <InputLabel id="profile-city-label">City</InputLabel>
              <Select
                labelId="profile-city-label"
                value={form.city}
                label="City"
                disabled={!form.state}
                onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              >
                {filteredCities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Zip Code"
              value={form.zipCode}
              helperText="5-6 digits"
              onChange={(event) => setForm((current) => ({ ...current, zipCode: event.target.value }))}
            />
          </Grid>
          {managerInfo ? (
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Reporting Manager"
                value={`${managerInfo.name}${managerInfo.email ? ` (${managerInfo.email})` : ""}`}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          ) : null}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0.5 }} />
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
                  }}
                />
              }
              label="Change Password"
            />
          </Grid>
          {changePassword ? (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={form.password ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
            </Grid>
          ) : null}
          <Grid size={{ xs: 12 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1.5 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<SaveRoundedIcon />}
                sx={{
                  minWidth: 168,
                  py: 1.2,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
                  boxShadow: "0 10px 22px rgba(47, 65, 86, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
                    boxShadow: "0 12px 26px rgba(47, 65, 86, 0.24)",
                  },
                }}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                variant="contained"
                onClick={onCancel}
                sx={{
                  minWidth: 168,
                  py: 1.2,
                  borderRadius: "8px",
                  background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)",
                  color: "#567C8D",
                  boxShadow: "0 8px 18px rgba(86, 124, 141, 0.14)",
                  "&:hover": {
                    background: "linear-gradient(180deg, #ffffff 0%, #ece2dc 100%)",
                    boxShadow: "0 10px 20px rgba(86, 124, 141, 0.18)",
                  },
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
