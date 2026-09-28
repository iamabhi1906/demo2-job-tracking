import type { Metadata } from "next";
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Job Dashboard",
};

export default async function AdminJobDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Stack direction="row">
        <Typography variant="h4">Admin Job Dashboard</Typography>
      </Stack>
      {children}
    </main>
  );
}
