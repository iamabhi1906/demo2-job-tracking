"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthCard } from "../auth-card/auth-card";
import { AuthField } from "../auth-field/auth-field";
import { AuthPasswordField } from "../auth-password-field/auth-password-field";
import { GoogleButton } from "../google-button/google-button";
import { OrDivider } from "../or-divider/or-divider";
import { SubmitButton } from "../submit-button/submit-button";
import styles from "./login-form.module.css";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { loginWithEmail } from "@/lib/firebase/auth";
import { getFirebaseAuthError } from "@/lib/firebase/errors";
import { createSession, SessionError } from "@/lib/auth/session-client";

const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await loginWithEmail(values.email, values.password);
      const idToken = await user.getIdToken();
      const sessionUser = await createSession(idToken);
      enqueueSnackbar(`Welcome back, ${sessionUser.name}`, {
        variant: "success",
      });
      router.replace(
        sessionUser.role === "applicant" ? "/applicant" : "/admin",
      );
      router.refresh();
    } catch (error) {
      if (error instanceof SessionError && error.status === 403) {
        enqueueSnackbar("Please verify your email before signing in.", {
          variant: "error",
        });
        return;
      }
      const message = getFirebaseAuthError(error);
      enqueueSnackbar(message, { variant: "error" });
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Enter your details to pick up where you left off"
    >
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <GoogleButton />
        <OrDivider />
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          register={register("email")}
        />
        <AuthPasswordField
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          register={register("password")}
        />
        <Stack className={styles.optionsRow} direction="row">
          <Typography
            component={Link}
            href={"/forgot-password"}
            variant="button"
            color="primary"
          >
            Forgot password?
          </Typography>
        </Stack>
        <SubmitButton loading={isSubmitting} loadingLabel="Signing in...">
          Sign in
        </SubmitButton>
      </form>
      <Stack spacing={1} direction="row" sx={{ justifyContent: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Don&apos;t have an account?
        </Typography>
        <Typography
          component={Link}
          href="/signup"
          variant="body2"
          color="primary"
        >
          Create one
        </Typography>
      </Stack>
    </AuthCard>
  );
}
