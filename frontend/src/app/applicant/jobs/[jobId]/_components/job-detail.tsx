"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { StatusChip } from "@/components/applications/status-chip";
import applyToJob from "@/services/applicants/apply-job";
import getMyApplications from "@/services/applicants/get-my-applications";
import getJob from "@/services/jobs/get-job";
import type { Application } from "@/services/applicants/applicant.schema";
import type { Job } from "@/services/jobs/job.schema";
import { formatDate, formatEmploymentType } from "@/lib/format-job";

interface JobDetailProps {
  jobId: string;
}

interface DetailState {
  loading: boolean;
  job: Job | null;
  applied: Application | null;
  error: string | null;
}

const initialState: DetailState = {
  loading: true,
  job: null,
  applied: null,
  error: null,
};

export function JobDetail({ jobId }: JobDetailProps) {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [state, setState] = useState(initialState);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getJob(jobId), getMyApplications({ jobId, limit: 1 })])
      .then(([job, response]) => {
        if (cancelled) return;
        setState({
          loading: false,
          job,
          applied: response.applications[0] ?? null,
          error: null,
        });
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setState({
          ...initialState,
          loading: false,
          error:
            caught instanceof Error
              ? caught.message
              : "Failed to load this job.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const onApply = async () => {
    setIsApplying(true);
    try {
      await applyToJob(jobId);
      enqueueSnackbar("Application submitted. Good luck!", {
        variant: "success",
      });
      router.push("/applicant");
      router.refresh();
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to apply.",
        { variant: "error" },
      );
      setIsApplying(false);
    }
  };

  if (state.loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={48} />
        <Skeleton variant="rounded" height={220} />
      </Stack>
    );
  }

  if (state.error || !state.job) {
    return <Alert severity="error">{state.error ?? "Job not found."}</Alert>;
  }

  const { job, applied } = state;
  const closed = job.status === "closed";

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 1, flexWrap: "wrap", gap: 1, alignItems: "center" }}
        >
          <Chip size="small" label={formatEmploymentType(job.employmentType)} />
          <Chip
            size="small"
            label={`Apply by ${formatDate(job.applicationDeadline)}`}
            variant="outlined"
          />
          {closed && (
            <Chip
              size="small"
              label="Closed"
              color="error"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography variant="h5" component="h1" gutterBottom>
          {job.title}
        </Typography>

        <Stack spacing={0.5} sx={{ color: "text.secondary", mb: 2 }}>
          {job.department && (
            <Typography variant="body2">{job.department}</Typography>
          )}
          {job.location && (
            <Typography variant="body2">{job.location}</Typography>
          )}
          <Typography variant="body2">
            {job.minimumExperience ?? 0}+ years experience
          </Typography>
        </Stack>

        {job.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {job.tags.map((tag) => (
              <Chip
                key={tag.id}
                size="small"
                label={tag.name}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        {applied ? (
          <Alert severity="success" sx={{ width: "100%" }}>
            You applied on {formatDate(applied.appliedAt)}.{" "}
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                ml: 0.5,
              }}
            >
              Status:
              <StatusChip status={applied.status} />
            </Box>
          </Alert>
        ) : (
          <Button
            variant="contained"
            fullWidth
            disabled={closed || isApplying}
            loading={isApplying}
            loadingPosition="center"
            loadingIndicator="Applying..."
            onClick={onApply}
          >
            Apply for this job
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
