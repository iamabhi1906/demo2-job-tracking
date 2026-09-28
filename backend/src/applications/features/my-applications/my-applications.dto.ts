import { z } from "zod";
import { APPLICATION_STATUS_VALUES } from "../../enums/application-status.enum.js";

export const myApplicationsSchema = z.object({
	status: z.enum(APPLICATION_STATUS_VALUES, "Status is not a supported application status").optional(),
	jobId: z.uuid("Job id must be a valid uuid").optional(),
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

export type MyApplicationsDto = z.infer<typeof myApplicationsSchema>;
