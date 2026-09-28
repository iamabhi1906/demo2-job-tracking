import Chip from "@mui/material/Chip";
import type { ApplicationStatus } from "@/services/applicants/applicant.schema";
import {
  APPLICATION_STATUS_COLORS,
  formatStatus,
} from "@/lib/application-status";

export function StatusChip({
  status,
  size = "small",
}: {
  status: ApplicationStatus;
  size?: "small" | "medium";
}) {
  return (
    <Chip
      label={formatStatus(status)}
      color={APPLICATION_STATUS_COLORS[status]}
      size={size}
      variant={status === "withdrawn" ? "outlined" : "filled"}
    />
  );
}
