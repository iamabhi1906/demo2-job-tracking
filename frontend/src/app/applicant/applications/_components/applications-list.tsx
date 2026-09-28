"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { StatusChip } from "@/components/applications/status-chip";
import { StatusHistoryDialog } from "@/components/applications/status-history-dialog";
import { StatusTransitionDialog } from "@/components/applications/status-transition-dialog";
import getMyApplications from "@/services/applicants/get-my-applications";
import updateApplicationStatus from "@/services/applicants/update-application-status";
import {
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/services/applicants/applicant.schema";
import {
  PAGE_SIZE,
  STATUS_OPTIONS,
  useApplicationSearch,
} from "./use-application-search";

interface ListState {
  loading: boolean;
  applications: Application[];
  total: number;
  error: string | null;
}

const initialState: ListState = {
  loading: true,
  applications: [],
  total: 0,
  error: null,
};

export function ApplicationsList() {
  const { enqueueSnackbar } = useSnackbar();
  const { status, page, update, dto } = useApplicationSearch();
  const [state, setState] = useState(initialState);
  const [historyFor, setHistoryFor] = useState<Application | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<Application | null>(
    null,
  );

  useEffect(() => {
    setState(initialState);
    let cancelled = false;

    getMyApplications(dto)
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
              : "Failed to load your applications.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [dto]);

  const { loading, applications, total, error } = state;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const confirmWithdraw = async (
    nextStatus: ApplicationStatus,
    note: string,
  ) => {
    const target = withdrawTarget;
    if (!target) return;

    await updateApplicationStatus(target.id, nextStatus, note);
    enqueueSnackbar("Application withdrawn.", { variant: "success" });
    setWithdrawTarget(null);
    getMyApplications(dto)
      .then((response) =>
        setState({
          loading: false,
          applications: response.applications,
          total: response.total,
          error: null,
        }),
      )
      .catch(() => undefined);
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
            My applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loading
              ? "Loading applications..."
              : `${total} ${total === 1 ? "application" : "applications"}`}
          </Typography>
        </Box>

        <TextField
          select
          size="small"
          label="Filter by status"
          value={status}
          onChange={(event) =>
            update({ status: event.target.value as ApplicationStatus | "" })
          }
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All statuses</MenuItem>
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {APPLICATION_STATUS_LABELS[option]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : applications.length === 0 ? (
          <Alert severity="info">
            {status
              ? "You have no applications with that status."
              : "You have not applied to any jobs yet."}
          </Alert>
        ) : (
          applications.map((application) => (
            <Paper key={application.id} variant="outlined" sx={{ p: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ alignItems: { sm: "center" } }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" component="h2">
                    {application.job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Applied on{" "}
                    {dayjs(application.appliedAt).format("D MMM YYYY")}
                    {application.job.department
                      ? ` · ${application.job.department}`
                      : ""}
                    {application.job.location
                      ? ` · ${application.job.location}`
                      : ""}
                  </Typography>
                </Box>

                <StatusChip status={application.status} />

                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    onClick={() => setHistoryFor(application)}
                  >
                    History
                  </Button>
                  {application.allowedTransitions.includes("withdrawn") && (
                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => setWithdrawTarget(application)}
                    >
                      Withdraw
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))
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

      <StatusHistoryDialog
        open={historyFor !== null}
        applicationId={historyFor?.id ?? null}
        title={historyFor ? `History · ${historyFor.job.title}` : "History"}
        onClose={() => setHistoryFor(null)}
      />

      <StatusTransitionDialog
        open={withdrawTarget !== null}
        title={
          withdrawTarget ? `Withdraw · ${withdrawTarget.job.title}` : "Withdraw"
        }
        targets={["withdrawn"]}
        submitLabel="Withdraw application"
        onClose={() => setWithdrawTarget(null)}
        onConfirm={confirmWithdraw}
      />
    </Box>
  );
}
