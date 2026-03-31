import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useToast } from "../../../components/feedback/ToastProvider";
import { routePaths } from "../../../routes/route-paths";
import { authApi } from "../api/auth.api";
import type { AuthLocationLookups } from "../types/auth.types";
import { AuthPageShell } from "../components/AuthPageShell";

const emptyLookups: AuthLocationLookups = {
  countries: [],
  states: [],
  cities: [],
};

export function SignupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    countryId: "",
    stateId: "",
    cityId: "",
    password: "",
    confirmPassword: "",
  });
  const [lookups, setLookups] = useState<AuthLocationLookups>(emptyLookups);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLookups, setIsLoadingLookups] = useState(true);

  useEffect(() => {
    async function loadLookups() {
      try {
        setIsLoadingLookups(true);
        setLookups(await authApi.getLocationLookups());
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Unable to load location data.", "error");
      } finally {
        setIsLoadingLookups(false);
      }
    }

    void loadLookups();
  }, [showToast]);

  const availableStates = useMemo(
    () =>
      form.countryId
        ? lookups.states.filter((state) => state.countryId === form.countryId)
        : [],
    [form.countryId, lookups.states],
  );

  const availableCities = useMemo(
    () => (form.stateId ? lookups.cities.filter((city) => city.stateId === form.stateId) : []),
    [form.stateId, lookups.cities],
  );

  const handleChange =
    (field: keyof typeof form) =>
    (
      event:
        | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string>,
    ) => {
      const nextValue = event.target.value;

      if (field === "countryId") {
        setForm((current) => ({
          ...current,
          countryId: nextValue,
          stateId: "",
          cityId: "",
        }));
        return;
      }

      if (field === "stateId") {
        setForm((current) => ({
          ...current,
          stateId: nextValue,
          cityId: "",
        }));
        return;
      }

      setForm((current) => ({ ...current, [field]: nextValue }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const requiredFields: Array<keyof typeof form> = [
      "firstName",
      "lastName",
      "emailId",
      "countryId",
      "stateId",
      "cityId",
      "password",
      "confirmPassword",
    ];

    const hasEmptyField = requiredFields.some((field) => !form[field].trim());
    if (hasEmptyField) {
      showToast("Please fill in all signup fields.", "warning");
      return;
    }

    if (form.password !== form.confirmPassword) {
      showToast("Password and confirm password must match.", "warning");
      return;
    }

    if (!acceptedTerms) {
      showToast("Please accept the terms and privacy policy.", "warning");
      return;
    }

    const selectedCountry = lookups.countries.find((country) => country.id === form.countryId);
    const selectedState = lookups.states.find((state) => state.id === form.stateId);
    const selectedCity = lookups.cities.find((city) => city.id === form.cityId);

    if (!selectedCountry || !selectedState || !selectedCity) {
      showToast("Please choose valid country, state, and city values.", "warning");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authApi.signup({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        emailId: form.emailId.trim(),
        country: selectedCountry.name,
        state: selectedState.name,
        city: selectedCity.name,
        role: "manager",
        password: form.password,
      });

      showToast(response.message, "success");
      navigate(routePaths.login);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to create account.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Create Account"
      title="Set up a new TaskFlow account"
      subtitle="Create your manager account and start inviting employees to your workspace."
      routeLabel="/signup"
      panelLabel="Create Manager Account"
      highlights={["Manager onboarding", "Location fields", "Password setup"]}
      footer={
        <Stack direction="row" justifyContent="center" spacing={0.75} flexWrap="wrap">
          <Typography sx={{ fontSize: 14, color: "#567C8D" }}>Already have an account?</Typography>
          <Link
            component={RouterLink}
            to={routePaths.login}
            underline="hover"
            sx={{ fontSize: 14, fontWeight: 800, color: "#2F4156" }}
          >
            Back to login
          </Link>
        </Stack>
      }
    >
      <Stack spacing={0.65}>
        <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#2F4156" }}>Create Account</Typography>
        <Typography sx={{ color: "#567C8D", lineHeight: 1.65, fontSize: 14 }}>
          Set up your manager account to add employees and assign tasks.
        </Typography>
      </Stack>

      <Grid container spacing={1.6} component="form" onSubmit={handleSubmit}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="First Name" placeholder="Sarah" value={form.firstName} onChange={handleChange("firstName")} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Last Name" placeholder="Johnson" value={form.lastName} onChange={handleChange("lastName")} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Email Address"
            placeholder="sarah.johnson@email.com"
            value={form.emailId}
            onChange={handleChange("emailId")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineRoundedIcon sx={{ color: "#567C8D", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <Select
              value={form.countryId}
              displayEmpty
              disabled={isLoadingLookups}
              onChange={handleChange("countryId")}
              renderValue={(value) => {
                const selectedValue = typeof value === "string" ? value : "";
                return selectedValue
                  ? lookups.countries.find((country) => country.id === selectedValue)?.name ?? selectedValue
                  : "Select Country";
              }}
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
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <Select
              value={form.stateId}
              displayEmpty
              disabled={isLoadingLookups || !form.countryId}
              onChange={handleChange("stateId")}
              renderValue={(value) => {
                const selectedValue = typeof value === "string" ? value : "";
                return selectedValue
                  ? availableStates.find((state) => state.id === selectedValue)?.name ?? selectedValue
                  : "Select State";
              }}
            >
              <MenuItem value="">Select State</MenuItem>
              {availableStates.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <Select
              value={form.cityId}
              displayEmpty
              disabled={isLoadingLookups || !form.stateId}
              onChange={handleChange("cityId")}
              renderValue={(value) => {
                const selectedValue = typeof value === "string" ? value : "";
                return selectedValue
                  ? availableCities.find((city) => city.id === selectedValue)?.name ?? selectedValue
                  : "Select City";
              }}
            >
              <MenuItem value="">Select City</MenuItem>
              {availableCities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <PersonAddAlt1RoundedIcon sx={{ color: "#567C8D", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange("confirmPassword")}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={<Checkbox checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />}
            label={<Typography sx={{ fontSize: 14, color: "#567C8D" }}>I agree to the terms and privacy policy</Typography>}
            sx={{ mt: -0.5 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            disabled={isSubmitting || isLoadingLookups}
            sx={{
              py: 1.3,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
              boxShadow: "0 16px 34px rgba(47, 65, 86, 0.2)",
              "&:hover": {
                background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
              },
            }}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </Grid>
      </Grid>
    </AuthPageShell>
  );
}
