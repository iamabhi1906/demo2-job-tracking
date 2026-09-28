"use client";

import { MUIProvider } from "./mui";
import SnackbarProviderWrapper from "./snackbar";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MUIProvider>
      <SnackbarProviderWrapper>{children}</SnackbarProviderWrapper>
    </MUIProvider>
  );
}
