"use client";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./submit-button.module.css";

interface SubmitButtonProps {
  loading?: boolean;
  loadingLabel: string;
  children: React.ReactNode;
}

export function SubmitButton({
  loading,
  loadingLabel,
  children,
}: SubmitButtonProps) {
  return (
    <Button
      className={styles.button}
      disabled={loading}
      fullWidth
      size="large"
      type="submit"
      variant="contained"
    >
      {loading ? (
        <span className={styles.loading}>
          <CircularProgress
            className={styles.spinner}
            color="inherit"
            size={18}
            thickness={5}
          />
          {loadingLabel}
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
