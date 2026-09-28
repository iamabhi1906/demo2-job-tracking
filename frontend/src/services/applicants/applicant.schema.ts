import { z } from "zod";
import { jobSchema } from "@/services/jobs/job.schema";

export const applicationStatusSchema = z.enum([
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected",
  "withdrawn",
]);

export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  hired: "Hired",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const ACTIVE_STATUSES: ApplicationStatus[] = [
  "applied",
  "shortlisted",
  "interview",
  "offer",
];

export const TERMINAL_STATUSES: ApplicationStatus[] = [
  "hired",
  "rejected",
  "withdrawn",
];

export const tagSchema = z.object({ id: z.string(), name: z.string() });

export const applicantProfileSchema = z.object({
  id: z.string(),
  yearsOfExperience: z.coerce.number().nullish(),
  resumeUrl: z.string().nullish(),
  aboutMe: z.string().nullish(),
  tags: z.array(tagSchema).default([]),
});

export type ApplicantProfile = z.infer<typeof applicantProfileSchema>;

export const applicationSchema = z.object({
  id: z.string(),
  status: applicationStatusSchema,
  appliedAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullish(),
  job: jobSchema,
  allowedTransitions: z.array(applicationStatusSchema).default([]),
});

export type Application = z.infer<typeof applicationSchema>;

export const myApplicationsResponseSchema = z.object({
  applications: z.array(applicationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type MyApplicationsResponse = z.infer<
  typeof myApplicationsResponseSchema
>;

export const adminApplicationSchema = z.object({
  id: z.string(),
  status: applicationStatusSchema,
  appliedAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullish(),
  job: z
    .object({
      id: z.string(),
      title: z.string(),
      department: z.string().nullish(),
      location: z.string().nullish(),
      status: z.enum(["open", "closed"]),
    })
    .nullish(),
  candidate: z.object({
    applicantId: z.string(),
    name: z.string().nullish(),
    email: z.string().nullish(),
    yearsOfExperience: z.coerce.number().nullish(),
    tags: z.array(tagSchema).default([]),
  }),
  rejectionCount: z.coerce.number().default(0),
  allowedTransitions: z.array(applicationStatusSchema).default([]),
});

export type AdminApplication = z.infer<typeof adminApplicationSchema>;

export const adminApplicationsResponseSchema = z.object({
  applications: z.array(adminApplicationSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type AdminApplicationsResponse = z.infer<
  typeof adminApplicationsResponseSchema
>;

export const statusHistoryEntrySchema = z.object({
  id: z.string(),
  previousStatus: applicationStatusSchema.nullable(),
  newStatus: applicationStatusSchema,
  actorRole: z.enum(["admin", "applicant", "system"]),
  actor: z
    .object({
      id: z.string(),
      name: z.string().nullish(),
      email: z.string().nullish(),
    })
    .nullable(),
  note: z.string().nullish(),
  createdAt: z.coerce.date(),
});

export type StatusHistoryEntry = z.infer<typeof statusHistoryEntrySchema>;

export const applicationHistoryResponseSchema = z.object({
  applicationId: z.string(),
  status: applicationStatusSchema,
  history: z.array(statusHistoryEntrySchema),
});

export type ApplicationHistoryResponse = z.infer<
  typeof applicationHistoryResponseSchema
>;

export const updateApplicationStatusResponseSchema = z.object({
  application: z.object({ id: z.string(), status: applicationStatusSchema }),
  allowedTransitions: z.array(applicationStatusSchema),
});

export type UpdateApplicationStatusResponse = z.infer<
  typeof updateApplicationStatusResponseSchema
>;
