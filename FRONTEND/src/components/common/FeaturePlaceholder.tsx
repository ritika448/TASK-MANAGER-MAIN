import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { PageSkeleton } from "./PageSkeleton";

type FeaturePlaceholderProps = {
  title: string;
  description: string;
  route: string;
  highlights?: string[];
  children?: ReactNode;
};

export function FeaturePlaceholder({
  title,
  description,
  route,
  highlights = [],
  children,
}: FeaturePlaceholderProps) {
  return (
    <Stack spacing={3}>
      <PageSkeleton title={title} subtitle={description} />
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Route
            </Typography>
            <Typography variant="body1">{route}</Typography>
          </Box>
          {highlights.length > 0 ? (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {highlights.map((item) => (
                <Chip key={item} label={item} color="primary" variant="outlined" />
              ))}
            </Stack>
          ) : null}
          {children}
          <Button variant="contained" sx={{ alignSelf: "flex-start" }}>
            Replace With Real UI
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

