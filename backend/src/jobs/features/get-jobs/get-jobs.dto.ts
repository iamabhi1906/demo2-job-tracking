import { z } from "zod";

export const getJobsSchema = z.object({
	q: z.string("Search must be a string").trim().min(1).optional(),
	department: z.string("Department must be a string").trim().min(1).optional(),
	employmentType: z
		.enum(["full_time", "part_time", "contract", "internship"], "Employment type is not supported")
		.optional(),
	location: z.string("Location must be a string").trim().min(1).optional(),
	minimumExperience: z.coerce
		.number("Minimum experience must be a number")
		.min(0, "Minimum experience must be at least 0")
		.optional(),
	status: z
		.enum(["open", "closed"], "Status must be either open or closed")
		.optional(),
	tags: z.preprocess(
		(value) => {
			if (Array.isArray(value)) return value;
			if (typeof value === "string") {
				const list = value
					.split(",")
					.map((entry) => entry.trim())
					.filter(Boolean);
				return list.length > 0 ? list : undefined;
			}
			return undefined;
		},
		z.array(z.string().trim().min(1)).optional(),
	),
	sortBy: z
		.enum(["createdDate", "applicationDeadline"], "Cannot sort by this field")
		.default("createdDate"),
	sortOrder: z.enum(["ASC", "DESC"], "Sort order must be ASC or DESC").default("DESC"),
	page: z.coerce
		.number("Page must be a number")
		.int("Page must be a whole number")
		.min(0, "Page cannot be negative")
		.default(0),
	limit: z.coerce
		.number("Limit must be a number")
		.int("Limit must be a whole number")
		.min(1, "Limit must be at least 1")
		.max(50, "Limit must be at most 50")
		.default(20),
});

export type GetJobsDto = z.infer<typeof getJobsSchema>;
