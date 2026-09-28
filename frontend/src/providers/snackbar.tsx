"use client";

import { SnackbarProvider } from "notistack";

export default function SnackbarProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SnackbarProvider anchorOrigin={{ vertical: "top", horizontal: "right" }}>
      {children}
    </SnackbarProvider>
  );
}
