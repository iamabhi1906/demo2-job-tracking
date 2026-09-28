import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function JobsPage() {
  return (
    <Box>
      <Typography>Job Dashboard Page for Admin</Typography>
      <Button>
        <Link href="/admin/jobs/create">Create Job</Link>
      </Button>
    </Box>
  );
}
