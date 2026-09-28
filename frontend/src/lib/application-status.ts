import type { ChipProps } from "@mui/material/Chip";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  TERMINAL_STATUSES,
} from "@/services/applicants/applicant.schema";

export const APPLICATION_STATUS_COLORS: Record<
  ApplicationStatus,
  ChipProps["color"]
> = {
  applied: "default",
  shortlisted: "info",
  interview: "primary",
  offer: "warning",
  hired: "success",
  rejected: "error",
  withdrawn: "default",
};

export { APPLICATION_STATUS_LABELS, TERMINAL_STATUSES };

export const isTerminalStatus = (status: ApplicationStatus): boolean =>
  TERMINAL_STATUSES.includes(status);

export const formatStatus = (status: ApplicationStatus): string =>
  APPLICATION_STATUS_LABELS[status];

export const ACTOR_ROLE_LABELS: Record<
  "admin" | "applicant" | "system",
  string
> = {
  admin: "Admin",
  applicant: "Applicant",
  system: "System",
};
