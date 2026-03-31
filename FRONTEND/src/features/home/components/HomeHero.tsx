import { Stack, Typography } from "@mui/material";

type HomeHeroProps = {
  firstName?: string;
};

export function HomeHero({ firstName = "User" }: HomeHeroProps) {
  return (
    <Stack spacing={0.5}>
      <Typography
        sx={{
          fontSize: { xs: 28, md: 40 },
          lineHeight: 1.1,
          fontWeight: 800,
          color: "#111827",
          letterSpacing: -1.2,
        }}
      >
        Welcome back, {firstName}!
      </Typography>
      <Typography sx={{ fontSize: 18, color: "#6b7280" }}>
        Here&apos;s what&apos;s happening today in your workspace.
      </Typography>
    </Stack>
  );
}
