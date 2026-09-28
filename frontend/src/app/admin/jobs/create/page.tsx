import Box from "@mui/material/Box";
import JobCreationForm from "./_components/job-creation-form/job-creation-form";
import styles from "./page.module.css";
import Link from "next/link";
import { ArrowBack } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

export default function JobCreationPage() {
  return (
    <Box className={styles.page}>
      <Link href="/admin/jobs">
        <Button startIcon={<ArrowBack />} variant="text">
          <Typography variant="h6">Back to Jobs</Typography>
        </Button>
      </Link>
      <JobCreationForm />
    </Box>
  );
}
