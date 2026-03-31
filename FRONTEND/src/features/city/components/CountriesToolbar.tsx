import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Box, InputAdornment, Stack, TextField } from "@mui/material";
import type { ChangeEvent } from "react";

type CountriesToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function CountriesToolbar({ searchValue, onSearchChange }: CountriesToolbarProps) {
  return (
    <Box
      sx={{
        p: 1.5,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={1}
      >
        <TextField
          size="small"
          placeholder="Search countries..."
          value={searchValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", sm: 220 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#8ca0ad", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}
