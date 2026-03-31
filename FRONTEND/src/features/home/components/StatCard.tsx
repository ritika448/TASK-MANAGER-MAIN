import { Avatar, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: number;
  icon: ReactNode;
  iconBackground: string;
  iconColor: string;
};

export function StatCard({ label, value, icon, iconBackground, iconColor }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        background: "linear-gradient(135deg, #FEFFFF 0%, #F5EFEB 55%, #C8D9E6 100%)",
        boxShadow: "0 8px 24px rgba(47, 65, 86, 0.06)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack spacing={0.75}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>
            {label}
          </Typography>
          <Typography sx={{ fontSize: 24, lineHeight: 1, fontWeight: 800, color: "#111827" }}>
            {value}
          </Typography>
        </Stack>

        <Avatar
          variant="rounded"
          sx={{
            width: 40,
            height: 40,
            bgcolor: iconBackground,
            color: iconColor,
            borderRadius: 2,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Paper>
  );
}
