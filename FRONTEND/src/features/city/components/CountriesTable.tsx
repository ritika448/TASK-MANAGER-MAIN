import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { CountryRecord } from "../api/countries.api";

type CountriesTableProps = {
  countries: CountryRecord[];
  loading?: boolean;
  onEditCountry: (country: CountryRecord) => void;
  onDeleteCountry: (country: CountryRecord) => void;
};

export function CountriesTable({
  countries,
  loading = false,
  onEditCountry,
  onDeleteCountry,
}: CountriesTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        background: "linear-gradient(180deg, #FEFFFF 0%, #ffffff 26%, #F5EFEB 100%)",
        boxShadow: "0 10px 26px rgba(47, 65, 86, 0.06)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ px: 2.5, py: 1.25 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1.25,
              border: "1px solid #e5e7eb",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            Show
          </Box>
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>10</Typography>
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>entries</Typography>
        </Stack>
      </Box>

      <Table>
        <TableHead
          sx={{
            background:
              "linear-gradient(90deg, rgba(200,217,230,0.52) 0%, rgba(245,239,235,0.88) 48%, rgba(200,217,230,0.4) 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Country Name</TableCell>
            <TableCell align="right" sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                <CircularProgress size={28} />
              </TableCell>
            </TableRow>
          ) : countries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} align="center" sx={{ py: 5 }}>
                <Typography sx={{ color: "#567C8D" }}>No countries found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            countries.map((country) => (
              <TableRow key={country.id} hover>
                <TableCell sx={{ fontWeight: 600, color: "#374151" }}>{country.countryName}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEditCountry(country)} sx={{ color: "#2F4156" }}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton sx={{ color: "#ef4444" }} onClick={() => onDeleteCountry(country)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: "1px solid #d9e5ec",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
          Showing {countries.length === 0 ? 0 : 1} to {countries.length} of {countries.length} entries
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 1.25,
              border: "1px solid #e5e7eb",
              color: "#cbd5e1",
              fontSize: 12,
            }}
          >
            Previous
          </Box>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: 1.25,
              bgcolor: "#2F4156",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            1
          </Box>
          <Box
            sx={{
              px: 1.25,
              py: 0.5,
              borderRadius: 1.25,
              border: "1px solid #e5e7eb",
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Next
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
