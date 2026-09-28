"use client";

import dayjs from "dayjs";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { StatusHistoryEntry } from "@/services/applicants/applicant.schema";
import { ACTOR_ROLE_LABELS, formatStatus } from "@/lib/application-status";
import { StatusChip } from "./status-chip";

const describeActor = (entry: StatusHistoryEntry): string =>
  entry.actor?.name ?? entry.actor?.email ?? "Unknown user";

export function StatusHistoryTimeline({
  history,
}: {
  history: StatusHistoryEntry[];
}) {
  if (history.length === 0) {
    return (
      <Alert severity="info">No status changes have been recorded yet.</Alert>
    );
  }

  return (
    <Stack spacing={1.5}>
      {history.map((entry) => (
        <Paper key={entry.id} variant="outlined" sx={{ p: 1.5 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: entry.note ? 0.5 : 0,
            }}
          >
            {entry.previousStatus ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  {formatStatus(entry.previousStatus)}
                </Typography>
                <Typography variant="body2" color="text.secondary" aria-hidden>
                  &rarr;
                </Typography>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Application created
              </Typography>
            )}

            <StatusChip status={entry.newStatus} />

            <Box sx={{ flexGrow: 1 }} />

            <Typography variant="caption" color="text.secondary">
              {dayjs(entry.createdAt).format("D MMM YYYY, HH:mm")}
            </Typography>
          </Stack>

          <Typography variant="body2">
            {describeActor(entry)} ({ACTOR_ROLE_LABELS[entry.actorRole]})
          </Typography>

          {entry.note && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontStyle: "italic" }}
            >
              {entry.note}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  );
}
