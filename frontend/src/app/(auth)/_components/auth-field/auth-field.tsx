"use client";

import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import type { UseFormRegisterReturn } from "react-hook-form";
import styles from "./auth-field.module.css";

interface AuthFieldProps extends Omit<TextFieldProps, "error"> {
  register: UseFormRegisterReturn;
  error?: string;
}

export function AuthField({
  register,
  error,
  className,
  ...props
}: AuthFieldProps) {
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
