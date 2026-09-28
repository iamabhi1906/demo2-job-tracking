"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { TagSelect } from "@/components/tags/tag-select/tag-select";
import getJobs from "@/services/jobs/get-jobs";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/services/applicants/applicant.schema";
import {
  RISK_THRESHOLD_OPTIONS,
  type AdminApplicationFilters,
} from "./use-admin-application-search";

const STATUS_OPTIONS = Object.keys(
  APPLICATION_STATUS_LABELS,
) as ApplicationStatus[];

export function ApplicationFiltersPanel({
  filters,
  onChange,
}: {
  filters: AdminApplicationFilters;
  onChange: (patch: Partial<AdminApplicationFilters>) => void;
}) {
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    getJobs({ limit: 50, sortBy: "createdDate", sortOrder: "DESC" })
      .then((response) => {
        if (cancelled) return;
        setJobs(response.jobs.map((job) => ({ id: job.id, title: job.title })));
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Stack spacing={2.5} component="aside">
      <Box>
        <Typography variant="overline" color="text.secondary">
          Candidate or job
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Name, email or job title"
          value={filters.q}
          onChange={(event) => onChange({ q: event.target.value })}
        />
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">
          Status
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={filters.statuses}
          slotProps={{
            select: {
              multiple: true,
              renderValue: (value: unknown) => {
                const selected = (value ?? []) as ApplicationStatus[];
                return selected.length
                  ? selected
                      .map((status) => APPLICATION_STATUS_LABELS[status])
                      .join(", ")
                  : "Any status";
              },
            },
          }}
          onChange={(event) => {
            const value = event.target.value;
            onChange({
              statuses: (typeof value === "string"
                ? value.split(",")
                : value) as ApplicationStatus[],
            });
          }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox
                size="small"
                checked={filters.statuses.includes(option)}
              />
              {APPLICATION_STATUS_LABELS[option]}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">
          Job
        </Typography>
        <TextField
          select
          fullWidth
          size="small"
          value={filters.jobId}
          onChange={(event) => onChange({ jobId: event.target.value })}
        >
          <MenuItem value="">Any job</MenuItem>
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">
          Applied between
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            type="date"
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            value={filters.appliedFrom}
            onChange={(event) => onChange({ appliedFrom: event.target.value })}
          />
          <TextField
            type="date"
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            value={filters.appliedTo}
            onChange={(event) => onChange({ appliedTo: event.target.value })}
          />
        </Stack>
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">
          Candidate skill
        </Typography>
        <TagSelect
          value={filters.tags}
          onChange={(tags) => onChange({ tags })}
          allowCreate={false}
          label="Filter by skill"
        />
      </Box>

      <Box>
        <Typography variant="overline" color="text.secondary">
          Rejections
        </Typography>
        <TextField
          type="number"
          fullWidth
          size="small"
          placeholder="At most"
          value={filters.maxRejections}
          onChange={(event) => onChange({ maxRejections: event.target.value })}
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          helperText="Hide candidates rejected more than this many times, across all jobs."
        />
        <TextField
          select
          fullWidth
          size="small"
          sx={{ mt: 1 }}
          value={filters.riskThreshold}
          onChange={(event) => onChange({ riskThreshold: event.target.value })}
          helperText="Flag candidates at or above this total."
        >
          {RISK_THRESHOLD_OPTIONS.map((value) => (
            <MenuItem key={value} value={String(value)}>
              {value === 0 ? "Never flag" : `Flag at ${value}+`}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button
        size="small"
        onClick={() =>
          onChange({
            q: "",
            statuses: [],
            jobId: "",
            appliedFrom: "",
            appliedTo: "",
            tags: [],
            maxRejections: "",
          })
        }
      >
        Clear filters
      </Button>
    </Stack>
  );
}
