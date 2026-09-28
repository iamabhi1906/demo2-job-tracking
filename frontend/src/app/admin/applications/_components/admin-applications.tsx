"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { StatusChip } from "@/components/applications/status-chip";
import { StatusHistoryDialog } from "@/components/applications/status-history-dialog";
import { StatusTransitionDialog } from "@/components/applications/status-transition-dialog";
import getAdminApplications from "@/services/applicants/get-admin-applications";
import updateApplicationStatus from "@/services/applicants/update-application-status";
import type {
  AdminApplication,
  ApplicationStatus,
} from "@/services/applicants/applicant.schema";
import { formatStatus } from "@/lib/application-status";
import { ApplicationFiltersPanel } from "./application-filters";
import {
  PAGE_SIZE,
  SORT_OPTIONS,
  useAdminApplicationSearch,
} from "./use-admin-application-search";

interface ListState {
  loading: boolean;
  applications: AdminApplication[];
  total: number;
  error: string | null;
}

const initialState: ListState = {
  loading: true,
  applications: [],
  total: 0,
  error: null,
};

const displayName = (application: AdminApplication): string =>
  application.candidate.name ??
  application.candidate.email ??
  "Unnamed candidate";

export function AdminApplications() {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, page, sort, riskThreshold, update, dto } =
    useAdminApplicationSearch();
  const [state, setState] = useState(initialState);
  const [historyFor, setHistoryFor] = useState<AdminApplication | null>(null);
  const [transitionFor, setTransitionFor] = useState<AdminApplication | null>(
    null,
  );

  const load = (currentDto: typeof dto) =>
    getAdminApplications(currentDto)
      .then((response) =>
        setState({
          loading: false,
          applications: response.applications,
          total: response.total,
          error: null,
        }),
      )
      .catch((caught: unknown) =>
        setState({
          ...initialState,
          loading: false,
          error:
            caught instanceof Error
              ? caught.message
              : "Failed to load applications.",
        }),
      );

  useEffect(() => {
    setState(initialState);
    let cancelled = false;

    const timer = setTimeout(() => {
      getAdminApplications(dto)
        .then((response) => {
          if (cancelled) return;
          setState({
            loading: false,
            applications: response.applications,
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
              caught instanceof Error
                ? caught.message
                : "Failed to load applications.",
          });
        });
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [dto]);

  const { loading, applications, total, error } = state;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const flagged = applications.filter(
    (application) =>
      riskThreshold > 0 && application.rejectionCount >= riskThreshold,
  ).length;

  const confirmTransition = async (status: ApplicationStatus, note: string) => {
    const target = transitionFor;
    if (!target) return;

    await updateApplicationStatus(target.id, status, note);
    enqueueSnackbar(
      `${displayName(target)} moved to ${formatStatus(status)}.`,
      {
        variant: status === "rejected" ? "warning" : "success",
      },
    );
    setTransitionFor(null);
    await load(dto);
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3, alignItems: { sm: "center" } }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1">
            Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Loading applications..."
              : `${total} ${total === 1 ? "application" : "applications"}${
                  flagged > 0 ? ` · ${flagged} flagged on this page` : ""
                }`}
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          label="Sort by"
          value={sort}
          onChange={(event) => update({ sort: event.target.value })}
          sx={{ minWidth: 220 }}
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
          <ApplicationFiltersPanel
            filters={filters}
            onChange={(patch) => update({ filters: { ...filters, ...patch } })}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Stack spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
              <Typography color="text.secondary">Loading...</Typography>
            ) : applications.length === 0 ? (
              <Alert severity="info">
                No applications match these filters. Try widening the rejection
                cutoff or clearing a filter.
              </Alert>
            ) : (
              applications.map((application) => {
                const isFlagged =
                  riskThreshold > 0 &&
                  application.rejectionCount >= riskThreshold;

                return (
                  <Paper key={application.id} variant="outlined" sx={{ p: 2 }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ alignItems: { md: "center" } }}
                    >
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Typography variant="subtitle1" component="h2">
                            {displayName(application)}
                          </Typography>
                          <Tooltip
                            title={`Rejected ${application.rejectionCount} ${application.rejectionCount === 1 ? "time" : "times"} across all their applications`}
                          >
                            <Chip
                              size="small"
                              variant={isFlagged ? "filled" : "outlined"}
                              color={isFlagged ? "error" : "default"}
                              label={`${application.rejectionCount} rejected`}
                            />
                          </Tooltip>
                        </Stack>

                        <Typography variant="body2" color="text.secondary">
                          {application.job?.title ?? "Unknown job"}
                          {application.job?.department
                            ? ` · ${application.job.department}`
                            : ""}
                          {application.job?.location
                            ? ` · ${application.job.location}`
                            : ""}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          Applied{" "}
                          {dayjs(application.appliedAt).format("D MMM YYYY")}
                          {application.candidate.yearsOfExperience
                            ? ` · ${application.candidate.yearsOfExperience} yrs experience`
                            : ""}
                        </Typography>

                        {application.candidate.tags.length > 0 && (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
                          >
                            {application.candidate.tags.map((tag) => (
                              <Chip
                                key={tag.id}
                                size="small"
                                label={tag.name}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>

                      <StatusChip status={application.status} />

                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          onClick={() => setHistoryFor(application)}
                        >
                          History
                        </Button>
                        {application.allowedTransitions.length > 0 && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setTransitionFor(application)}
                          >
                            Move
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                );
              })
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

      <StatusHistoryDialog
        open={historyFor !== null}
        applicationId={historyFor?.id ?? null}
        title={historyFor ? `History · ${displayName(historyFor)}` : "History"}
        onClose={() => setHistoryFor(null)}
      />

      <StatusTransitionDialog
        open={transitionFor !== null}
        title={transitionFor ? `Move · ${displayName(transitionFor)}` : "Move"}
        targets={transitionFor?.allowedTransitions ?? []}
        onClose={() => setTransitionFor(null)}
        onConfirm={confirmTransition}
      />
    </Box>
  );
}
