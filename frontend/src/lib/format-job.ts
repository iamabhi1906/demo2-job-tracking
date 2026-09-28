export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  internship: "Internship",
};

export const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  closed: "Closed",
};

export const EMPLOYMENT_TYPES = Object.entries(EMPLOYMENT_TYPE_LABELS);
export const STATUSES = Object.entries(STATUS_LABELS);

export function formatEmploymentType(value: string): string {
  return EMPLOYMENT_TYPE_LABELS[value] ?? value;
}

export function formatStatus(value: string): string {
  return STATUS_LABELS[value] ?? value;
}

export function formatDate(value: Date | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

export function isDeadlinePassed(deadline: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(deadline).setHours(0, 0, 0, 0) < today.getTime();
}
