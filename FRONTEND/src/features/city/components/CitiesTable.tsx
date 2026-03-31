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
import type { CityRecord } from "../api/cities.api";

type CitiesTableProps = {
  cities: CityRecord[];
  loading?: boolean;
  onEditCity: (city: CityRecord) => void;
  onDeleteCity: (city: CityRecord) => void;
};

export function CitiesTable({
  cities,
  loading = false,
  onEditCity,
  onDeleteCity,
}: CitiesTableProps) {
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
      <Table>
        <TableHead
          sx={{
            background:
              "linear-gradient(90deg, rgba(200,217,230,0.52) 0%, rgba(245,239,235,0.88) 48%, rgba(200,217,230,0.4) 100%)",
          }}
        >
          <TableRow>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>City Name</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>State Name</TableCell>
            <TableCell sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>Zip Code(s)</TableCell>
            <TableCell align="right" sx={{ color: "#567C8D", fontWeight: 800, bgcolor: "transparent" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                <CircularProgress size={28} />
              </TableCell>
            </TableRow>
          ) : cities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                <Typography sx={{ color: "#567C8D" }}>No cities found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            cities.map((city) => (
              <TableRow key={city.id} hover>
                <TableCell sx={{ fontWeight: 600, color: "#374151" }}>{city.cityName}</TableCell>
                <TableCell sx={{ color: "#4b5563" }}>{city.stateName}</TableCell>
                <TableCell sx={{ color: "#4b5563" }}>{city.zipCodes.join(", ")}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEditCity(city)} sx={{ color: "#64748b" }}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton sx={{ color: "#64748b" }} onClick={() => onDeleteCity(city)}>
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
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>Rows per page:</Typography>
          <Box
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 1.25,
              border: "1px solid #e5e7eb",
              color: "#64748b",
              fontSize: 12,
            }}
          >
            10
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
            {cities.length === 0 ? "0-0" : `1-${cities.length}`} of {cities.length}
          </Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 16 }}>{`<`}</Typography>
          <Typography sx={{ color: "#94a3b8", fontSize: 16 }}>{`>`}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
