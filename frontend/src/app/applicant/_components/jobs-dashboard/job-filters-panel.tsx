"use client";

import type { ChangeEvent } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { TagSelect } from "@/components/tags/tag-select/tag-select";
import { EMPLOYMENT_TYPES, STATUSES } from "./jobs-dashboard.utils";
import { emptyFilters, type JobFilters, useJobSearch } from "./use-job-search";

type FilterField = {
  key: Exclude<keyof JobFilters, "tags">;
  label: string;
  options?: [string, string][];
};

const FIELDS: FilterField[] = [
  {
    key: "employmentType",
    label: "Employment type",
    options: EMPLOYMENT_TYPES,
  },
  { key: "status", label: "Status", options: STATUSES },
  { key: "department", label: "Department" },
  { key: "location", label: "Location" },
];

const isActive = (filters: JobFilters) =>
  Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value !== "",
  );

interface FilterInputProps {
  field: FilterField;
  value: string;
  onChange: (value: string) => void;
}

function FilterInput({ field, value, onChange }: FilterInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);

  return field.options ? (
    <TextField
      select
      label={field.label}
      value={value}
      onChange={handleChange}
      fullWidth
    >
      <MenuItem value="">Any</MenuItem>
      {field.options.map(([optionValue, optionLabel]) => (
        <MenuItem key={optionValue} value={optionValue}>
          {optionLabel}
        </MenuItem>
      ))}
    </TextField>
  ) : (
    <TextField
      label={field.label}
      value={value}
      onChange={handleChange}
      fullWidth
    />
  );
}

export function JobFiltersPanel() {
  const { filters, update } = useJobSearch();

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="row" sx={{ mb: 2, alignItems: "center" }}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
            Filters
          </Typography>
          <Button
            startIcon={<ClearIcon />}
            onClick={() => update({ filters: emptyFilters })}
            disabled={!isActive(filters)}
          >
            Clear
          </Button>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField
              label="Search title"
              value={filters.q}
              onChange={(event) =>
                update({ filters: { ...filters, q: event.target.value } })
              }
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
            />
          </Grid>

          {FIELDS.map((field) => (
            <Grid size={{ xs: 12, sm: 6 }} key={field.key}>
              <FilterInput
                field={field}
                value={filters[field.key]}
                onChange={(value) =>
                  update({ filters: { ...filters, [field.key]: value } })
                }
              />
            </Grid>
          ))}

          <Grid size={12}>
            <TagSelect
              value={filters.tags}
              onChange={(tags) => update({ filters: { ...filters, tags } })}
              allowCreate={false}
              label="Filter by tags"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
