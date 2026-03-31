import { Box, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type PageHeaderCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeaderCard({ title, description, action }: PageHeaderCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: "1px solid #C8D9E6",
        background:
          "linear-gradient(135deg, rgba(254,255,255,0.98) 0%, rgba(245,239,235,0.96) 54%, rgba(200,217,230,0.88) 100%)",
        boxShadow: "0 18px 40px rgba(47, 65, 86, 0.08)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -30,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(86,124,141,0.20) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -30,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,217,230,0.55) 0%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ position: "relative", zIndex: 1 }}
      >
        <Stack spacing={0.75}>
          <Typography sx={{ fontSize: { xs: 28, md: 32 }, fontWeight: 800, color: "#2F4156" }}>
            {title}
          </Typography>
          {description ? (
            <Typography sx={{ color: "#567C8D", maxWidth: 720, fontSize: 15 }}>
              {description}
            </Typography>
          ) : null}
        </Stack>

        {action ? <Box sx={{ alignSelf: { xs: "stretch", md: "center" } }}>{action}</Box> : null}
      </Stack>
    </Paper>
  );
}
