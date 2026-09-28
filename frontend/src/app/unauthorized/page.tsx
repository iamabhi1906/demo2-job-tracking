import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import styles from "./page.module.css";

interface UnauthorizedPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function UnauthorizedPage({
  searchParams,
}: UnauthorizedPageProps) {
  const params = await searchParams;

  return (
    <main className={styles.main}>
      <Paper elevation={20} className={styles.card}>
        <span className={styles.badge}>
          <LockOutlinedIcon fontSize="large" />
        </span>
        <Stack spacing={1} sx={{ alignItems: "center" }}>
          <Typography component="h1" variant="h2" className={styles.title}>
            Unauthorized
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className={styles.subtitle}
          >
            You are not authorized to view this page.
          </Typography>
        </Stack>
        <Typography variant="body2" className={styles.message}>
          {params.message ?? "Access is forbidden"}
        </Typography>
        <Button fullWidth variant="contained">
          <Link href="/">Back to homepage</Link>
        </Button>
        <Button fullWidth variant="outlined">
          <Link href="/login">Sign in with a different account</Link>
        </Button>
      </Paper>
    </main>
  );
}
