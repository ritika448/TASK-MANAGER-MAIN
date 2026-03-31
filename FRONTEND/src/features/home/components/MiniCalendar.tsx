import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import type { TaskRecord } from "../../tasks/api/tasks.api";
import { getTaskStatus } from "../../tasks/utils/task-ui";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

type MiniCalendarProps = {
  tasks: TaskRecord[];
};

type DayHighlight = {
  bg: string;
  color: string;
  ring?: string;
  count: number;
};

function getMonthGrid(currentMonth: Date) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from({ length: firstDay }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function buildHighlights(tasks: TaskRecord[], currentMonth: Date) {
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const result = new Map<number, DayHighlight>();

  tasks.forEach((task) => {
    if (!task.dueDate) {
      return;
    }

    const dueDate = new Date(task.dueDate);
    if (dueDate.getMonth() !== month || dueDate.getFullYear() !== year) {
      return;
    }

    const day = dueDate.getDate();
    const status = getTaskStatus(task);
    const existing = result.get(day);

    const nextHighlight: DayHighlight = existing
      ? {
          ...existing,
          count: existing.count + 1,
          bg: existing.bg === "#fee2e2" || status.bg === "#fee2e2" ? "#fee2e2" : existing.bg,
          color: existing.color === "#dc2626" || status.color === "#dc2626" ? "#dc2626" : existing.color,
          ring:
            existing.ring ||
            (status.label === "Completed"
              ? "#16a34a"
              : status.label === "Overdue"
                ? "#dc2626"
                : "#2F4156"),
        }
      : {
          bg:
            status.label === "Completed"
              ? "#dcfce7"
              : status.label === "Overdue"
                ? "#fee2e2"
                : "#dce8ef",
          color:
            status.label === "Completed"
              ? "#16a34a"
              : status.label === "Overdue"
                ? "#dc2626"
                : "#2F4156",
          ring:
            status.label === "Completed"
              ? "#16a34a"
              : status.label === "Overdue"
                ? "#dc2626"
                : "#2F4156",
          count: 1,
        };

    result.set(day, nextHighlight);
  });

  return result;
}

export function MiniCalendar({ tasks }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const calendarDays = useMemo(() => getMonthGrid(currentMonth), [currentMonth]);
  const highlightedDays = useMemo(() => buildHighlights(tasks, currentMonth), [currentMonth, tasks]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        background: "linear-gradient(180deg, #FEFFFF 0%, #ffffff 24%, #F5EFEB 100%)",
        boxShadow: "0 10px 26px rgba(47, 65, 86, 0.06)",
      }}
    >
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}>Calendar</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <IconButton
            size="small"
            onClick={() =>
              setCurrentMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#374151" }}>
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              setCurrentMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
            gap: 1.1,
            textAlign: "center",
          }}
        >
          {weekDays.map((day) => (
            <Typography key={day} sx={{ fontSize: 12, fontWeight: 700, color: "#9ca3af" }}>
              {day}
            </Typography>
          ))}

          {calendarDays.map((day, index) => {
            if (!day) {
              return <Box key={`empty-${index}`} sx={{ height: 36 }} />;
            }

            const highlight = highlightedDays.get(day);

            return (
              <Box
                key={`${currentMonth.toISOString()}-${day}`}
                sx={{
                  width: 34,
                  height: 34,
                  mx: "auto",
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: highlight?.color ?? "#4b5563",
                  bgcolor: highlight?.bg ?? "transparent",
                  boxShadow: highlight?.ring ? `0 0 0 2px ${highlight.ring} inset` : "none",
                  position: "relative",
                }}
              >
                {day}
                {highlight && highlight.count > 1 ? (
                  <Box
                    sx={{
                      position: "absolute",
                      right: -2,
                      top: -2,
                      minWidth: 16,
                      height: 16,
                      px: 0.4,
                      borderRadius: "999px",
                      bgcolor: "#2F4156",
                      color: "#FEFFFF",
                      fontSize: 9,
                      fontWeight: 700,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {highlight.count}
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
      </Stack>
    </Paper>
  );
}
