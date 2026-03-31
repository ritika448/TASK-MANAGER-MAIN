import { Box, type BoxProps } from "@mui/material";

type PageRevealProps = BoxProps & {
  delay?: number;
};

export function PageReveal({ delay = 0, className, sx, children, ...rest }: PageRevealProps) {
  return (
    <Box
      className={["page-reveal", className].filter(Boolean).join(" ")}
      sx={{
        "--reveal-delay": `${Math.round(delay * 1.45)}ms`,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}
