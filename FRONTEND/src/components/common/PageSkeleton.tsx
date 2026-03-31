import { Paper, Skeleton, Stack, Typography } from "@mui/material";

type PageSkeletonProps = {
  title: string;
  subtitle: string;
};

export function PageSkeleton({ title, subtitle }: PageSkeletonProps) {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
        <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
          <Skeleton variant="rounded" width={220} height={52} />
          <Skeleton variant="rounded" width={220} height={52} />
          <Skeleton variant="rounded" width={120} height={52} />
        </Stack>
      </Stack>
    </Paper>
  );
}

