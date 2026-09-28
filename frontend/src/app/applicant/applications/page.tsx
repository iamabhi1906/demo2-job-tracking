import { Suspense } from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ApplicationsList } from "./_components/applications-list";

export const metadata: Metadata = { title: "My applications" };

export default function MyApplicationsPage() {
  return (
    <Box sx={{ mx: "auto", px: 3, py: 4, maxWidth: 1000 }}>
      <Suspense fallback={<Typography>Loading applications...</Typography>}>
        <ApplicationsList />
      </Suspense>
    </Box>
  );
}
