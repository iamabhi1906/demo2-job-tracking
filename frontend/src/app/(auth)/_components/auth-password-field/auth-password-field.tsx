"use client";

import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { AuthField } from "../auth-field/auth-field";
import styles from "./auth-password-field.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface AuthPasswordFieldProps {
  register: UseFormRegisterReturn;
  error?: string;
  label?: string;
  autoComplete?: string;
}

export function AuthPasswordField({
  register,
  error,
  label = "Password",
  autoComplete,
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      register={register}
      error={error}
      label={label}
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton
              aria-label={visible ? "Hide password" : "Show password"}
              className={styles.toggle}
              edge="end"
              onClick={() => setVisible((value) => !value)}
              type="button"
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          ),
        },
      }}
    />
  );
}
