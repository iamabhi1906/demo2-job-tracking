import { z } from "zod";

export const getTagsSchema = z.object({
	page: z.coerce.number().int().min(0),
	limit: z.coerce.number().int().min(1).max(100),
	q: z.string().trim().optional(),
});

export type GetTagsDto = z.infer<typeof getTagsSchema>;
