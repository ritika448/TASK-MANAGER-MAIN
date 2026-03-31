import { Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type SettingsSectionCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function SettingsSectionCard({
  title,
  description,
  children,
}: SettingsSectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #C8D9E6",
        background: "linear-gradient(180deg, #FEFFFF 0%, #ffffff 30%, #F5EFEB 100%)",
        boxShadow: "0 10px 26px rgba(47, 65, 86, 0.06)",
      }}
    >
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
            {title}
          </Typography>
          <Typography sx={{ color: "#6b7280" }}>{description}</Typography>
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}
