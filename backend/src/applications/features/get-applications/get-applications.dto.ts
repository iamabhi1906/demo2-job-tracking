import { z } from "zod";
import { APPLICATION_STATUS_VALUES } from "../../enums/application-status.enum.js";

const toCsvArray = (value: unknown): unknown => {
	if (typeof value !== "string") return value;
	const parts = value
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);
	return parts.length ? parts : undefined;
};

const toEndOfDay = (value: unknown): unknown => {
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return value;
	const parsed = new Date(`${trimmed}T23:59:59.999Z`);
	return Number.isNaN(parsed.getTime()) ? value : parsed;
};

export const getApplicationsSchema = z.object({
	q: z.string("Search must be a string").trim().min(1).optional(),
	status: z.preprocess(
		toCsvArray,
		z
			.array(z.enum(APPLICATION_STATUS_VALUES, "Status is not a supported application status"))
			.min(1, "Provide at least one status")
			.optional(),
	),
	jobId: z.uuid("Job id must be a valid uuid").optional(),
	appliedFrom: z.coerce.date("Applied-from must be a valid date").optional(),
	appliedTo: z.preprocess(toEndOfDay, z.coerce.date("Applied-to must be a valid date")).optional(),
	tag: z.preprocess(toCsvArray, z.array(z.string().trim().min(1)).optional()),
	minRejections: z.coerce
		.number("Minimum rejections must be a number")
		.int("Minimum rejections must be a whole number")
		.min(0, "Minimum rejections cannot be negative")
		.optional(),
	maxRejections: z.coerce
		.number("Maximum rejections must be a number")
		.int("Maximum rejections must be a whole number")
		.min(0, "Maximum rejections cannot be negative")
		.optional(),
	sortBy: z.enum(["appliedAt", "rejectionCount", "status", "stage"], "Cannot sort by this field").default("appliedAt"),
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
		.max(100, "Limit must be at most 100")
		.default(20),
});

export type GetApplicationsDto = z.infer<typeof getApplicationsSchema>;
