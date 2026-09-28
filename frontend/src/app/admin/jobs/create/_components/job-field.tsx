"use client";

import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./job-field.module.css";

interface JobFieldProps extends Omit<TextFieldProps, "error"> {
  register: UseFormRegisterReturn;
  error?: string;
}

export function JobField({
  register,
  error,
  className,
  ...props
}: JobFieldProps) {
  return (
    <TextField
      {...register}
      {...props}
      error={Boolean(error)}
      helperText={error}
      fullWidth
      variant="outlined"
      className={`${styles.field} ${className ?? ""}`}
    />
  );
}
