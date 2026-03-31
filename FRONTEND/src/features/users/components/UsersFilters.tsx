import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
import type { ChangeEvent } from "react";

type UsersFiltersProps = {
  searchValue: string;
  cityOptions: Array<{ id: string; name: string }>;
  stateOptions: Array<{ id: string; name: string }>;
  countryOptions: Array<{ id: string; name: string }>;
  selectedCityId: string;
  selectedStateId: string;
  selectedCountryId: string;
  onSearchChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCountryChange: (value: string) => void;
};

export function UsersFilters({
  searchValue,
  cityOptions,
  stateOptions,
  countryOptions,
  selectedCityId,
  selectedStateId,
  selectedCountryId,
  onSearchChange,
  onCityChange,
  onStateChange,
  onCountryChange,
}: UsersFiltersProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        flex: 1,
      }}
    >
      <Stack direction={{ xs: "column", lg: "row" }} spacing={1} alignItems={{ lg: "center" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
          value={searchValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#8ca0ad", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={selectedCityId}
          onChange={(event) => onCityChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", lg: 126 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => {
              const selectedValue = typeof value === "string" ? value : "";
              return selectedValue
                ? cityOptions.find((option) => option.id === selectedValue)?.name ?? selectedValue
                : "All Cities";
            },
          }}
        >
          <MenuItem value="">All Cities</MenuItem>
          {cityOptions.map((city) => (
            <MenuItem key={city.id} value={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={selectedStateId}
          onChange={(event) => onStateChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", lg: 126 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => {
              const selectedValue = typeof value === "string" ? value : "";
              return selectedValue
                ? stateOptions.find((option) => option.id === selectedValue)?.name ?? selectedValue
                : "All States";
            },
          }}
        >
          <MenuItem value="">All States</MenuItem>
          {stateOptions.map((state) => (
            <MenuItem key={state.id} value={state.id}>
              {state.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          size="small"
          value={selectedCountryId}
          onChange={(event) => onCountryChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", lg: 138 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => {
              const selectedValue = typeof value === "string" ? value : "";
              return selectedValue
                ? countryOptions.find((option) => option.id === selectedValue)?.name ?? selectedValue
                : "All Countries";
            },
          }}
        >
          <MenuItem value="">All Countries</MenuItem>
          {countryOptions.map((country) => (
            <MenuItem key={country.id} value={country.id}>
              {country.name}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
    </Box>
  );
}
