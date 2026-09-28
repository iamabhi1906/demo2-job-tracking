import { Suspense } from "react";
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { JobsDashboard } from "./_components/jobs-dashboard/jobs-dashboard";

export const metadata: Metadata = {
  title: "Browse jobs",
};

export default function ApplicantDashboard() {
  return (
    <Box sx={{ mx: "auto", px: 3, py: 4 }}>
      <Typography
        variant="h5"
        component="p"
        color="text.secondary"
        gutterBottom
      >
        Applicant Dashboard
      </Typography>
      <Suspense fallback={<Typography>Loading jobs...</Typography>}>
        <JobsDashboard />
      </Suspense>
    </Box>
  );
}
