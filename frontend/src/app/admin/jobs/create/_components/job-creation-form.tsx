"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Controller, useForm } from "react-hook-form";
import createJob from "../../../../../services/jobs/create-job";
import {
  jobCreationSchema,
  jobCreationSchemaDefaultValues,
  type JobCreationSchemaInput,
  type JobCreationSchemaOutput,
} from "../_schema/job-creation.schema";
import { JobField } from "./job-field";
import { TagSelect } from "@/components/tags/tag-select/tag-select";
import styles from "./job-creation-form.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const EMPLOYMENT_TYPES = [
  { value: "full_time", label: "Full time" },
  { value: "part_time", label: "Part time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const;

const STATUSES = [
  { value: "open", label: "Open" },
  { value: "closed", label: "Closed" },
] as const;

/** Accepts the shapes the form may hold and hands the picker a Dayjs or null. */
function toDayjs(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  if (dayjs.isDayjs(value)) return value as dayjs.Dayjs;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    value instanceof Date
  ) {
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed : null;
  }
  return null;
}

export default function JobCreationForm() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobCreationSchemaInput, unknown, JobCreationSchemaOutput>({
    resolver: zodResolver(jobCreationSchema),
    defaultValues: jobCreationSchemaDefaultValues,
  });

  const onSubmit = async (values: JobCreationSchemaOutput) => {
    try {
      await createJob(values);
      enqueueSnackbar("Job created successfully!", {
        variant: "success",
      });
      router.replace("/admin/jobs");
      router.refresh();
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to create job.",
        { variant: "error" },
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card variant="outlined" className={styles.card}>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Create a job
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className={styles.subtitle}
          >
            Post a new opening. Applicants will see it in the job dashboard.
          </Typography>

          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <JobField
                  label="Title"
                  placeholder="Backend Engineer"
                  autoComplete="off"
                  error={errors.title?.message}
                  register={register("title")}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <JobField
                  label="Department"
                  placeholder="Engineering"
                  autoComplete="off"
                  error={errors.department?.message}
                  register={register("department")}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <JobField
                  label="Location"
                  placeholder="Remote"
                  autoComplete="off"
                  error={errors.location?.message}
                  register={register("location")}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  control={control}
                  name="employmentType"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      variant="outlined"
                      label="Employment type"
                      error={Boolean(errors.employmentType)}
                      helperText={errors.employmentType?.message}
                    >
                      {EMPLOYMENT_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <JobField
                  label="Minimum experience (years)"
                  type="number"
                  slotProps={{ htmlInput: { min: 0, max: 50, step: 1 } }}
                  error={errors.minimumExperience?.message}
                  register={register("minimumExperience")}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  control={control}
                  name="applicationDeadline"
                  render={({ field }) => (
                    <DateTimePicker
                      label="Application deadline"
                      format="YYYY-MM-DD HH:mm"
                      value={toDayjs(field.value)}
                      // Store an ISO string: the picker hands back a Dayjs
                      // instance, which the value guard cannot read back.
                      onChange={(value) =>
                        field.onChange(value ? value.toISOString() : null)
                      }
                      minDateTime={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: Boolean(errors.applicationDeadline),
                          helperText: errors.applicationDeadline?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      variant="outlined"
                      label="Status"
                      error={Boolean(errors.status)}
                      helperText={errors.status?.message}
                    >
                      {STATUSES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
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
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Stack
              direction="row"
              spacing={2}
              className={styles.actions}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                type="button"
                variant="outlined"
                disabled={isSubmitting}
                onClick={() => reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                loadingPosition="center"
                loadingIndicator="Creating..."
              >
                Create job
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
