"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import getJobs from "@/services/jobs/get-jobs";
import type { Job } from "@/services/jobs/job.schema";
import { JobCard } from "./job-card";
import { JobFiltersPanel } from "./job-filters-panel";
import { JobListSkeleton } from "./job-list-skeleton";
import { PAGE_SIZE, SORT_OPTIONS, useJobSearch } from "./use-job-search";

interface JobsState {
  loading: boolean;
  jobs: Job[];
  total: number;
  error: string | null;
}

const initialState: JobsState = {
  loading: true,
  jobs: [],
  total: 0,
  error: null,
};

export function JobsDashboard() {
  const { page, sort, update, dto } = useJobSearch();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    setState(initialState);
    let cancelled = false;

    const timer = setTimeout(() => {
      getJobs(dto)
        .then((response) => {
          if (cancelled) return;
          setState({
            loading: false,
            jobs: response.jobs,
            total: response.total,
            error: null,
          });
        })
        .catch((caught: unknown) => {
          if (cancelled) return;
          setState({
            ...initialState,
            loading: false,
            error:
              caught instanceof Error ? caught.message : "Failed to load jobs.",
          });
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dto]);

  const { loading, jobs, total, error } = state;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3, alignItems: { sm: "center" } }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            Open roles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Loading jobs..."
              : `${total} ${total === 1 ? "job" : "jobs"} found`}
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          label="Sort by"
          value={sort}
          onChange={(event) => update({ sort: event.target.value })}
          sx={{ minWidth: 200 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <JobFiltersPanel />
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
              <JobListSkeleton />
            ) : jobs.length === 0 ? (
              <Alert severity="info">
                No jobs match these filters. Try clearing some of them.
              </Alert>
            ) : (
              jobs.map((job) => <JobCard key={job.id} job={job} />)
            )}

            {!loading && totalPages > 1 && (
              <Pagination
                count={totalPages}
                page={page + 1}
                onChange={(_event, next) => update({ page: next - 1 })}
                sx={{ alignSelf: "center", pt: 1 }}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
