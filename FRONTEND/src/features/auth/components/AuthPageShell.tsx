import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import { Avatar, Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  routeLabel: string;
  panelLabel: string;
  highlights: string[];
  children: ReactNode;
  footer: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  subtitle,
  routeLabel,
  panelLabel,
  highlights,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: { xs: 1.5, sm: 2.5, md: 3.5 },
        py: { xs: 2, md: 3.5 },
        background:
          "radial-gradient(circle at top left, rgba(200,217,230,0.85) 0%, transparent 30%), linear-gradient(135deg, #C8D9E6 0%, #FEFFFF 48%, #F5EFEB 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 940,
          minHeight: { xs: "auto", md: "min(640px, calc(100vh - 44px))" },
          overflow: "hidden",
          borderRadius: 5,
          border: "1px solid rgba(200, 217, 230, 0.45)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 22px 52px rgba(47, 65, 86, 0.14)",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "0.82fr 1.18fr" },
            minHeight: { md: "inherit" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              p: { xs: 2.5, sm: 3, md: 3.4 },
              background:
                "radial-gradient(circle at top right, rgba(255,255,255,0.16) 0%, transparent 24%), linear-gradient(165deg, #2F4156 0%, #405973 48%, #567C8D 100%)",
              color: "#FEFFFF",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -60,
                right: -40,
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.16) 0%, transparent 72%)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: -40,
                bottom: -58,
                width: 170,
                height: 170,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,217,230,0.24) 0%, transparent 74%)",
              }}
            />
            <Stack spacing={2.4} sx={{ position: "relative", zIndex: 1, flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.16)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    color: "#FEFFFF",
                  }}
                >
                  <TaskAltRoundedIcon sx={{ fontSize: 24 }} />
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, opacity: 0.98, lineHeight: 1 }}>
                    TASKFLOW
                  </Typography>
                </Box>
              </Stack>

              <Box
                sx={{
                  my: "auto",
                  animation: "authPanelFloat 6.5s ease-in-out infinite",
                  "@keyframes authPanelFloat": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-12px)" },
                    "100%": { transform: "translateY(0px)" },
                  },
                }}
              >
                <Stack spacing={2.4}>
                  <Stack spacing={0.9}>
                    <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#FEFFFF", letterSpacing: 0.2 }}>
                      {eyebrow}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800, lineHeight: 1.12, maxWidth: 300 }}>
                      {title}
                    </Typography>
                    <Typography sx={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,0.82)", maxWidth: 320 }}>
                      {subtitle}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {highlights.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        sx={{
                          height: 30,
                          bgcolor: "rgba(255,255,255,0.12)",
                          color: "#FEFFFF",
                          border: "1px solid rgba(255,255,255,0.18)",
                          "& .MuiChip-label": {
                            px: 1.2,
                            fontSize: 11.5,
                            fontWeight: 700,
                          },
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack spacing={1} sx={{ pt: 0.5 }}>
                    {[
                      "Compact premium auth layout",
                      "Responsive and API-ready structure",
                    ].map((point) => (
                      <Stack key={point} direction="row" spacing={1.2} alignItems="center">
                        <CheckCircleRoundedIcon sx={{ fontSize: 16, color: "#C8D9E6" }} />
                        <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.86)" }}>
                          {point}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              p: { xs: 2.2, sm: 2.6, md: 3.2 },
              background: "linear-gradient(180deg, rgba(254,255,255,0.98) 0%, rgba(245,239,235,0.9) 100%)",
              display: "flex",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                my: "auto",
                width: "100%",
                maxWidth: 460,
                mx: "auto",
                p: { xs: 2, sm: 2.3, md: 2.5 },
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.4)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(254,255,255,0.92) 100%)",
                boxShadow: "0 14px 28px rgba(47, 65, 86, 0.08)",
              }}
            >
              <Stack spacing={2.4}>
                <Stack spacing={1}>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.25, color: "#567C8D" }}>
                    {panelLabel}
                  </Typography>
                  <Divider sx={{ borderColor: "rgba(200,217,230,0.88)" }} />
                </Stack>
                {children}
                <Divider sx={{ borderColor: "rgba(200,217,230,0.88)" }} />
                {footer}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
