import { Suspense } from "react";
import { Box } from "@mui/material";
import { JobDetail } from "./_components/job-detail";

export const metadata = {
  title: "Job detail",
};

export default async function JobDetailPage({
  params,
}: PageProps<"/applicant/jobs/[jobId]">) {
  const { jobId } = await params;

  return (
    <Box sx={{ mx: "auto", px: 3, py: 4, maxWidth: 900 }}>
      <Suspense fallback={null}>
        <JobDetail jobId={jobId} />
      </Suspense>
    </Box>
  );
}
