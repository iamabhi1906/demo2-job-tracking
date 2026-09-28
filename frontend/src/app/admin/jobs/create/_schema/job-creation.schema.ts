import { z } from "zod";

export const jobCreationSchema = z.object({
  title: z
    .string("Must provide a valid title")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),

  department: z
    .string("Must provide a valid department")
    .min(3, "Department must be at least 3 characters long")
    .max(50, "Department must be at most 50 characters long"),

  location: z
    .string("Must provide a valid location")
    .min(3, "Location must be at least 3 characters long")
    .max(50, "Location must be at most 50 characters long"),

  employmentType: z.enum(
    ["full_time", "part_time", "contract", "internship"],
    "Must provide a valid employment type",
  ),

  minimumExperience: z.coerce
    .number({ error: "Must provide a valid minimum experience" })
    .min(0, "Minimum experience must be at least 0 years")
    .max(50, "Minimum experience must be at most 50 years"),

  applicationDeadline: z.coerce
    .date({ error: "Must provide a valid application deadline" })
    .min(new Date(), "Application deadline must be in the future"),

  status: z.enum(["open", "closed"], "Must provide a valid status"),

  tags: z.array(z.string(), "Must provide a valid tag"),
});

export type JobCreationSchemaInput = z.input<typeof jobCreationSchema>;
export type JobCreationSchemaOutput = z.output<typeof jobCreationSchema>;
export type JobCreationSchema = z.infer<typeof jobCreationSchema>;

export const jobCreationSchemaDefaultValues = {
  title: "",
  department: "",
  location: "",
  employmentType: "full_time",
  minimumExperience: 0,
  applicationDeadline: undefined,
  status: "open",
  tags: [] as string[],
} satisfies JobCreationSchemaInput;
