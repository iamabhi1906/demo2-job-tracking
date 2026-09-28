import type { ReactNode } from "react";
import styles from "./auth-card.module.css";
import { Paper, Stack, Typography } from "@mui/material";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <Paper elevation={20} className={styles.card}>
      <Stack className={styles.heading}>
        <Typography className={styles.title} variant="h2" color="primary">
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {children}
    </Paper>
  );
}
