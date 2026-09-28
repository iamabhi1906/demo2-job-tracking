import { Suspense } from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdminApplications } from "./_components/admin-applications";

export const metadata: Metadata = { title: "Applications" };

export default function AdminApplicationsPage() {
  return (
    <Box sx={{ mx: "auto", px: 3, py: 4, maxWidth: 1400 }}>
      <Suspense fallback={<Typography>Loading applications...</Typography>}>
        <AdminApplications />
      </Suspense>
    </Box>
  );
}
