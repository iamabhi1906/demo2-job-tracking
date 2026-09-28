import { z } from "zod";

export const employmentTypeSchema = z.enum([
  "full_time",
  "part_time",
  "contract",
  "internship",
]);

export const jobStatusSchema = z.enum(["open", "closed"]);

export const getJobsSchema = z.object({
  q: z.string("Search must be a string").optional(),
  department: z.string("Department must be a string").optional(),
  employmentType: employmentTypeSchema.optional(),
  location: z.string("Location must be a string").optional(),
  minimumExperience: z.number("Minimum experience must be a number").optional(),
  status: jobStatusSchema.optional(),
  tags: z.array(z.string("Tag must be a string")).optional(),
  sortBy: z.enum(["createdDate", "applicationDeadline"]).optional(),
  sortOrder: z.enum(["ASC", "DESC"]).optional(),
  page: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(50).optional(),
});

export type GetJobsDto = z.infer<typeof getJobsSchema>;

export const jobSchema = z.object({
  id: z.string(),
  title: z.string(),
  department: z.string().nullish(),
  location: z.string().nullish(),
  employmentType: employmentTypeSchema,
  minimumExperience: z.coerce.number().nullish(),
  applicationDeadline: z.coerce.date(),
  status: jobStatusSchema,
  createdAt: z.coerce.date().nullish(),
  updatedAt: z.coerce.date().nullish(),
  createdBy: z.object({ id: z.string(), name: z.string().nullish() }).nullish(),
  tags: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
});

export type Job = z.infer<typeof jobSchema>;

export const getJobsResponseSchema = z.object({
  jobs: z.array(jobSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type GetJobsResponse = z.infer<typeof getJobsResponseSchema>;
