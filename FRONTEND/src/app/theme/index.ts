import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#2F4156",
      light: "#567C8D",
      dark: "#243546",
    },
    secondary: {
      main: "#567C8D",
    },
    background: {
      default: "#FEFFFF",
      paper: "#FEFFFF",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 800,
      letterSpacing: -0.8,
    },
    h5: {
      fontWeight: 800,
      letterSpacing: -0.5,
    },
    h6: {
      fontWeight: 800,
      letterSpacing: -0.3,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 700,
          minWidth: 168,
          justifyContent: "center",
          paddingInline: 18,
          paddingBlock: 10,
        },
        contained: {
          color: "#ffffff",
          background: "linear-gradient(135deg, #567C8D 0%, #2F4156 100%)",
          boxShadow: "0 10px 24px rgba(47, 65, 86, 0.24)",
        },
        containedPrimary: {
          "&:hover": {
            background: "linear-gradient(135deg, #6a91a3 0%, #243546 100%)",
            boxShadow: "0 12px 28px rgba(47, 65, 86, 0.3)",
          },
        },
        outlined: {
          borderColor: "#C8D9E6",
          color: "#2F4156",
          background: "linear-gradient(180deg, #FEFFFF 0%, #F5EFEB 100%)",
        },
        text: {
          color: "#2F4156",
          minWidth: "auto",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            background: "linear-gradient(180deg, #FEFFFF 0%, #F7F9FB 100%)",
            transition: "all 0.2s ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8aa8b8",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 4px rgba(86, 124, 141, 0.14)",
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backdropFilter: "blur(16px)",
        },
      },
    },
  },
});
