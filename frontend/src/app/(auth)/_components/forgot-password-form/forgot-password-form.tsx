"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "../auth-card/auth-card";
import { AuthField } from "../auth-field/auth-field";
import { SubmitButton } from "../submit-button/submit-button";
import styles from "./forgot-password-form.module.css";
import { Button, Stack, Typography } from "@mui/material";
import { sendPasswordReset } from "@/lib/firebase/auth";

const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await sendPasswordReset(data.email);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Check your inbox" subtitle="A reset link is on its way">
        <div className={styles.successBox}>
          <div>
            <p className={styles.successTitle}>Reset link sent</p>
            <p className={styles.successText}>
              We emailed a password reset link to{" "}
              <strong>{getValues("email")}</strong>. It expires in 30 minutes.
            </p>
          </div>
        </div>
        <Button LinkComponent={Link} href="/login" variant="contained">
          Back to sign in
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="No worries — enter your email and we'll send you a reset link."
    >
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          register={register("email")}
        />
        <SubmitButton loading={isSubmitting} loadingLabel="Sending link...">
          Send reset link
        </SubmitButton>
      </form>

      <Stack spacing={1} direction="row" sx={{ justifyContent: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Remembered it?
        </Typography>
        <Typography
          component={Link}
          href="/login"
          variant="body2"
          color="primary"
        >
          Back to sign in
        </Typography>
      </Stack>
    </AuthCard>
  );
}
