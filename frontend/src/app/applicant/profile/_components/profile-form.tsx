"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import { TagSelect } from "@/components/tags/tag-select/tag-select";
import { ResumeUpload } from "./resume-upload";
import {
  type ProfileFormInput,
  type ProfileFormValues,
  profileFormDefaultValues,
  profileFormSchema,
  updateProfile,
} from "@/services/applicants/update-profile";

const countWords = (value: string) =>
  value.trim().length === 0 ? 0 : value.trim().split(/\s+/).length;

const ABOUT_ME_MAX_WORDS = 500;

export function ProfileForm() {
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormInput, unknown, ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: profileFormDefaultValues,
  });

  const aboutMe = watch("aboutMe") ?? "";
  const resumeUrl = watch("resumeUrl") ?? null;
  const words = countWords(aboutMe);
  const overWordLimit = words > ABOUT_ME_MAX_WORDS;

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const profile = await updateProfile(values);
      reset({
        yearsOfExperience: profile.yearsOfExperience ?? undefined,
        aboutMe: profile.aboutMe ?? "",
        tags: profile.tags.map((tag) => tag.name),
      });
      enqueueSnackbar("Profile saved.", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to save your profile.",
        { variant: "error" },
      );
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom>
          Update your profile
        </Typography>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Years of experience"
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 50, step: 0.5 } }}
                error={Boolean(errors.yearsOfExperience)}
                helperText={errors.yearsOfExperience?.message}
                fullWidth
                {...register("yearsOfExperience")}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack spacing={1}>
                <Typography variant="body2">Resume</Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center" }}
                >
                  <ResumeUpload
                    label={resumeUrl ? "Replace" : "Upload"}
                    onUploaded={(url) => setValue("resumeUrl", url)}
                  />
                  {resumeUrl && (
                    <Link href={resumeUrl} target="_blank" rel="noreferrer">
                      View current resume
                    </Link>
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  PDF or Word, up to 5 MB.
                </Typography>
              </Stack>
            </Grid>

            <Grid size={12}>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagSelect
                    value={field.value ?? []}
                    onChange={field.onChange}
                    error={errors.tags?.message}
                    label="Skills"
                  />
                )}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="About me"
                placeholder="Tell employers a little about yourself."
                multiline
                minRows={6}
                fullWidth
                error={Boolean(errors.aboutMe) || overWordLimit}
                helperText={
                  overWordLimit
                    ? `About me must be at most ${ABOUT_ME_MAX_WORDS} words.`
                    : `${words} / ${ABOUT_ME_MAX_WORDS} words`
                }
                {...register("aboutMe")}
              />
            </Grid>
          </Grid>

          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, justifyContent: "flex-end" }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={isSubmitting || !isDirty}
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              loading={isSubmitting}
              loadingPosition="center"
              loadingIndicator="Saving..."
            >
              Save profile
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
