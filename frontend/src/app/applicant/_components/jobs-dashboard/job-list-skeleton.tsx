import Skeleton from "@mui/material/Skeleton";

const SKELETON_KEYS = Array.from(
  { length: 6 },
  (_value, index) => `skeleton-${index}`,
);

export function JobListSkeleton() {
  return (
    <>
      {SKELETON_KEYS.map((key) => (
        <Skeleton key={key} variant="rounded" height={190} />
      ))}
    </>
  );
}
