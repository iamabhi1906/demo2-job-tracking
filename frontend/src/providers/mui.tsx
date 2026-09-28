"use client";

import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  palette: {
    primary: {
      main: "#5d64e6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#977ae0",
      contrastText: "#000000",
    },
    success: {
      main: "#009843",
      contrastText: "#000000",
    },
    warning: {
      main: "#da9600",
      contrastText: "#000000",
    },
    error: {
      main: "#df2225",
      contrastText: "#ffffff",
    },
    info: {
      main: "#0081d0",
      contrastText: "#000000",
    },
    background: {
      default: "#f9fafc",
      paper: "#f0f2f5",
    },
    text: {
      primary: "#000000",
      secondary: "rgba(0, 0, 0, 0.68)",
    },
  },
  typography: {
    fontFamily:
      '"National Park", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export const MUIProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
