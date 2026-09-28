"use client";

import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import type { Job } from "@/services/jobs/job.schema";
import {
  formatDate,
  formatEmploymentType,
  formatStatus,
  isDeadlinePassed,
} from "@/lib/format-job";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const expired = isDeadlinePassed(job.applicationDeadline);
  const closed = job.status === "closed";

  // Rows without a value are dropped, so a missing field needs no branching.
  const meta = [
    {
      icon: <ApartmentOutlinedIcon fontSize="small" />,
      text: job.department,
    },
    { icon: <PlaceOutlinedIcon fontSize="small" />, text: job.location },
    {
      icon: <WorkOutlinedIcon fontSize="small" />,
      text: `${job.minimumExperience ?? 0}+ years experience`,
    },
    {
      icon: <ScheduleOutlinedIcon fontSize="small" />,
      text: `Apply by ${formatDate(job.applicationDeadline)}`,
    },
  ].filter((row) => row.text);

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 1, flexWrap: "wrap", gap: 1, alignItems: "center" }}
        >
          <Chip
            size="small"
            label={formatStatus(job.status)}
            color={closed ? "default" : "success"}
            variant={closed ? "outlined" : "filled"}
          />
          <Chip size="small" label={formatEmploymentType(job.employmentType)} />
          {expired && (
            <Chip
              size="small"
              label="Deadline passed"
              color="error"
              variant="outlined"
            />
          )}
        </Stack>

        <Typography variant="h6" component="h3" gutterBottom>
          {job.title}
        </Typography>

        <Stack spacing={0.5} sx={{ color: "text.secondary", mb: 2 }}>
          {meta.map(({ icon, text }) => (
            <Stack
              key={text}
              direction="row"
              spacing={1}
              sx={{ alignItems: "center" }}
            >
              {icon}
              <Typography variant="body2">{text}</Typography>
            </Stack>
          ))}
        </Stack>

        {job.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            {job.tags.map((tag) => (
              <Chip
                key={tag.id}
                size="small"
                label={tag.name}
                variant="outlined"
              />
            ))}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          variant="contained"
          disabled={closed || expired}
          fullWidth
          component={Link}
          href={`/applicant/jobs/${job.id}`}
        >
          View &amp; apply
        </Button>
      </CardActions>
    </Card>
  );
}
