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
import styles from "./signup-form.module.css";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { registerWithEmail } from "@/lib/firebase/auth";
import { getFirebaseAuthError } from "@/lib/firebase/errors";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name"),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await registerWithEmail(values.fullName, values.email, values.password);
    } catch (error) {
      enqueueSnackbar(getFirebaseAuthError(error), { variant: "error" });
      return;
    }
    enqueueSnackbar(
      `Please check your email, ${values.fullName.split(" ")[0]}`,
      {
        variant: "success",
      },
    );
    reset();
    router.push("/login");
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start exploring in less than a minute"
    >
      <form
        className={styles.form}
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <GoogleButton />
        <OrDivider />
        <AuthField
          label="Full name"
          autoComplete="name"
          error={errors.fullName?.message}
          register={register("fullName")}
        />
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          register={register("email")}
        />
        <AuthPasswordField
          label="Password"
          autoComplete="new-password"
          error={errors.password?.message}
          register={register("password")}
        />
        <AuthPasswordField
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          register={register("confirmPassword")}
        />
        <Typography variant="caption" color="textSecondary">
          Use 8+ characters with a number and an uppercase letter.
        </Typography>
        <SubmitButton loading={isSubmitting} loadingLabel="Creating account...">
          Create account
        </SubmitButton>
      </form>
      <Stack spacing={1} direction="row" sx={{ justifyContent: "center" }}>
        <Typography variant="body2" color="textSecondary">
          Already have an account?
        </Typography>
        <Typography
          component={Link}
          href="/login"
          variant="body2"
          color="primary"
        >
          Sign in
        </Typography>
      </Stack>
    </AuthCard>
  );
}
