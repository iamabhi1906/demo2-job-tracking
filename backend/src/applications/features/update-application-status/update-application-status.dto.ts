import { z } from "zod";
import { APPLICATION_STATUS_VALUES } from "../../enums/application-status.enum.js";

export const updateApplicationStatusSchema = z.object({
	status: z.enum(APPLICATION_STATUS_VALUES, "Status is not a supported application status"),
	note: z.string("Note must be a string").trim().max(1000, "Note cannot be longer than 1000 characters").optional(),
});

export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;
