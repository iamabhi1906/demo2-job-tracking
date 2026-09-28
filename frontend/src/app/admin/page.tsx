import { Box } from "@mui/material";
import { JobsDashboard } from "../applicant/_components/jobs-dashboard/jobs-dashboard";

export default function AdminDashboard() {
  return (
    <Box>
      <JobsDashboard isAdmin={true} />
    </Box>
  );
}
