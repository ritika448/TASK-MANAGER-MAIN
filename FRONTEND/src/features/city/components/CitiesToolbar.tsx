import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import {
  Button,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { ChangeEvent } from "react";
import type { LookupOption as CountryLookupOption } from "../api/countries.api";
import type { LookupOption as StateLookupOption } from "../api/states.api";

type CitiesToolbarProps = {
  searchValue: string;
  selectedStateId: string;
  selectedCountryId: string;
  stateOptions: StateLookupOption[];
  countryOptions: CountryLookupOption[];
  onSearchChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCountryChange: (value: string) => void;
};

export function CitiesToolbar({
  searchValue,
  selectedStateId,
  selectedCountryId,
  stateOptions,
  countryOptions,
  onSearchChange,
  onStateChange,
  onCountryChange,
}: CitiesToolbarProps) {
  return (
    <Box
      sx={{
        p: 1.5,
      }}
    >
      <Stack direction={{ xs: "column", xl: "row" }} spacing={1} alignItems={{ xl: "center" }}>
        <TextField
          size="small"
          placeholder="Search cities..."
          value={searchValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 220 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
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
          value={selectedStateId}
          onChange={(event) => onStateChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 126 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
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
          sx={{ minWidth: { xs: "100%", xl: 136 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
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

        <Stack direction="row" spacing={1} sx={{ ml: { xl: "auto" } }}>
          <Button
            variant="outlined"
            startIcon={<DownloadRoundedIcon />}
            sx={{
              minWidth: "auto",
              px: 1.6,
              py: 0.9,
              borderRadius: "8px",
              borderColor: "#C8D9E6",
              color: "#567C8D",
              background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)",
            }}
          >
            Export
          </Button>
          <IconButton sx={{ width: 40, height: 40, border: "1px solid #C8D9E6", borderRadius: 2, color: "#567C8D" }}>
            <ViewAgendaRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
