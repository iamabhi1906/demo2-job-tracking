"use client";

import { Box } from "@mui/material";
import { MUIProvider } from "./mui";
import SnackbarProviderWrapper from "./snackbar";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MUIProvider>
      <SnackbarProviderWrapper>
        <Box sx={{ px: { xs: 1, sm: 8 } }}>{children}</Box>
      </SnackbarProviderWrapper>
    </MUIProvider>
  );
}
