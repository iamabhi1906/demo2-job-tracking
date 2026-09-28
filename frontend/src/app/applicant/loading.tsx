import Stack from "@mui/material/Stack";
import { JobListSkeleton } from "./_components/jobs-dashboard/job-list-skeleton";

export default function Loading() {
  return (
    <Stack spacing={2}>
      <JobListSkeleton />
    </Stack>
  );
}
