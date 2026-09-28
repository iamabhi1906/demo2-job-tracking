"use client";

import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ApplicationStatus } from "@/services/applicants/applicant.schema";
import { formatStatus } from "@/lib/application-status";
import { StatusChip } from "./status-chip";

export function StatusTransitionDialog({
  open,
  title,
  targets,
  submitLabel = "Update status",
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  targets: ApplicationStatus[];
  submitLabel?: string;
  onClose: () => void;
  onConfirm: (status: ApplicationStatus, note: string) => Promise<void>;
}) {
  const [status, setStatus] = useState<ApplicationStatus | "">(
    targets[0] ?? "",
  );
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus(targets[0] ?? "");
    setNote("");
    setError(null);
    setSubmitting(false);
  }, [open, targets]);

  const submit = async () => {
    if (!status) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(status, note);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Failed to update the application.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ pt: 0.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {targets.length > 1 ? (
            <TextField
              select
              label="New status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ApplicationStatus)
              }
              size="small"
            >
              {targets.map((target) => (
                <MenuItem key={target} value={target}>
                  {formatStatus(target)}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                New status:
              </Typography>
              <StatusChip status={status as ApplicationStatus} />
            </Stack>
          )}

          <TextField
            label="Note (optional)"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            multiline
            minRows={2}
            size="small"
            slotProps={{ htmlInput: { maxLength: 1000 } }}
            helperText="Recorded on the audit trail, e.g. the reason for a rejection."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={submit}
          disabled={!status || submitting}
          loading={submitting}
        >
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
