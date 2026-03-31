import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ViewAgendaRoundedIcon from "@mui/icons-material/ViewAgendaRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";
import {
  alpha,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import type { ChangeEvent } from "react";
import { isEmployeeUser } from "../../../services/auth/auth-role";

type TaskFiltersProps = {
  viewMode: "list" | "card";
  searchValue: string;
  statusValue: string;
  priorityValue: string;
  assigneeValue: string;
  assigneeOptions: Array<{ id: string; name: string }>;
  fromDate: string;
  toDate: string;
  onViewChange: (view: "list" | "card") => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
};

export function TaskFilters({
  viewMode,
  searchValue,
  statusValue,
  priorityValue,
  assigneeValue,
  assigneeOptions,
  fromDate,
  toDate,
  onViewChange,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onFromDateChange,
  onToDateChange,
}: TaskFiltersProps) {
  const isEmployee = isEmployeeUser();

  return (
    <Box
      sx={{
        p: 1.5,
      }}
    >
      <Stack direction={{ xs: "column", xl: "row" }} spacing={1} alignItems={{ xl: "center" }}>
        <TextField
          size="small"
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 210 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
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
          value={statusValue}
          onChange={(event) => onStatusChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 120 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => (typeof value === "string" && value ? value : "All Status"),
          }}
        >
          <MenuItem value="">All Status</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={priorityValue}
          onChange={(event) => onPriorityChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 120 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => (typeof value === "string" && value ? value : "All Priority"),
          }}
        >
          <MenuItem value="">All Priority</MenuItem>
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          value={assigneeValue}
          onChange={(event) => onAssigneeChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 138 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          SelectProps={{
            displayEmpty: true,
            renderValue: (value) => {
              const selectedValue = typeof value === "string" ? value : "";
              return selectedValue
                ? assigneeOptions.find((option) => option.id === selectedValue)?.name ?? selectedValue
                : "All Assignees";
            },
          }}
        >
          <MenuItem value="">All Assignees</MenuItem>
          {assigneeOptions.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          size="small"
          type="date"
          value={fromDate}
          onChange={(event) => onFromDateChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 145 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarMonthRoundedIcon sx={{ color: "#6b7280", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          size="small"
          type="date"
          value={toDate}
          onChange={(event) => onToDateChange(event.target.value)}
          sx={{ minWidth: { xs: "100%", xl: 145 }, "& .MuiOutlinedInput-root": { minHeight: 42 } }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarMonthRoundedIcon sx={{ color: "#6b7280", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={1} sx={{ ml: { xl: "auto" } }}>
          <IconButton
            onClick={() => onViewChange("list")}
            sx={{
              border: "1px solid #C8D9E6",
              borderRadius: 2,
              width: 40,
              height: 40,
              bgcolor: viewMode === "list" ? alpha("#567C8D", 0.12) : "#ffffff",
              color: viewMode === "list" ? "#2F4156" : "#567C8D",
            }}
          >
            <ViewAgendaRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => onViewChange("card")}
            sx={{
              border: "1px solid #C8D9E6",
              borderRadius: 2,
              width: 40,
              height: 40,
              bgcolor: viewMode === "card" ? alpha("#567C8D", 0.12) : "#ffffff",
              color: viewMode === "card" ? "#2F4156" : "#567C8D",
            }}
          >
            <ViewModuleRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
