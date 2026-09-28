"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import getApplicationHistory from "@/services/applicants/get-application-history";
import type { StatusHistoryEntry } from "@/services/applicants/applicant.schema";
import { StatusHistoryTimeline } from "./status-history-timeline";

interface HistoryState {
  loading: boolean;
  history: StatusHistoryEntry[];
  error: string | null;
}

const initialState: HistoryState = { loading: true, history: [], error: null };

export function StatusHistoryDialog({
  applicationId,
  open,
  onClose,
  title,
}: {
  applicationId: string | null;
  open: boolean;
  onClose: () => void;
  title: string;
}) {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!open || !applicationId) return;

    let cancelled = false;
    setState(initialState);

    getApplicationHistory(applicationId)
      .then((response) => {
        if (!cancelled)
          setState({ loading: false, history: response.history, error: null });
      })
      .catch((caught: unknown) => {
        if (cancelled) return;
        setState({
          loading: false,
          history: [],
          error:
            caught instanceof Error
              ? caught.message
              : "Failed to load the history.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [open, applicationId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {state.error ? (
          <Alert severity="error">{state.error}</Alert>
        ) : state.loading ? (
          <Stack sx={{ alignItems: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Stack>
        ) : (
          <StatusHistoryTimeline history={state.history} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
