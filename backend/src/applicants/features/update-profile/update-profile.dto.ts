import { z } from "zod";


export const updateProfileSchema = z.object({
	yearsOfExperience: z.coerce
		.number("Years of experience must be a number")
		.min(0, "Years of experience cannot be negative")
		.max(50, "Years of experience must be at most 50")
		.optional(),
	aboutMe: z
		.string("About me must be text")
		.optional(),
	tags: z.array(z.string().trim().min(1), "Tags must be a list of names").max(10, "Pick at most 10 skills").optional(),
	resumeUrl: z.union([z.url("Resume must be a valid URL"), z.null()]).optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
