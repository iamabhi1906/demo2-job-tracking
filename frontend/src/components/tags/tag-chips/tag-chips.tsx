"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import styles from "./tag-chips.module.css";

export interface TagChipsProps {
  names: string[];
  onRemove?: (name: string) => void;
  emptyLabel?: string;
  size?: "small" | "medium";
}

export function TagChips({ names, size = "small" }: TagChipsProps) {
  if (names.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No tags selected yet
      </Typography>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      className={styles.chips}
      sx={{ flexWrap: "wrap" }}
    >
      {names.map((name) => (
        <Chip
          key={name}
          label={name}
          size={size}
          color="primary"
          variant="outlined"
        />
      ))}
    </Stack>
  );
}

export default TagChips;
