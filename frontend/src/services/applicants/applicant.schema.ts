import { z } from "zod";
import { jobSchema } from "@/services/jobs/job.schema";

export const applicationStatusSchema = z.enum([
  "applied",
  "under_review",
  "shortlisted",
  "rejected",
  "offered",
  "hired",
  "withdrawn",
]);

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  applied: "Applied",
  under_review: "Under review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  offered: "Offered",
  hired: "Hired",
  withdrawn: "Withdrawn",
};

export const tagSchema = z.object({ id: z.string(), name: z.string() });

export const applicantProfileSchema = z.object({
  id: z.string(),
  // TypeORM maps `numeric` to a string, so coerce rather than trust the type.
  yearsOfExperience: z.coerce.number().nullish(),
  /** The stored filename, not a fetchable URL: see the resume download route. */
  resumeUrl: z.string().nullish(),
  aboutMe: z.string().nullish(),
  tags: z.array(tagSchema).default([]),
});

export type ApplicantProfile = z.infer<typeof applicantProfileSchema>;

export const applicationSchema = z.object({
  id: z.string(),
  status: applicationStatusSchema,
  appliedAt: z.coerce.date(),
  job: jobSchema,
});

export type Application = z.infer<typeof applicationSchema>;

export const myApplicationsResponseSchema = z.object({
  applications: z.array(applicationSchema),
});
