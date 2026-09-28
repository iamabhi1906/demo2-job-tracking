import { z } from "zod";
import { api, toErrorMessage } from "@/lib/http";
import {
  applicantProfileSchema,
  type ApplicantProfile,
} from "./applicant.schema";

export const profileFormSchema = z.object({
  yearsOfExperience: z.coerce
    .number({ error: "Enter your years of experience as a number" })
    .min(0, "Years of experience cannot be negative")
    .max(50, "Years of experience must be at most 50")
    .optional(),
  aboutMe: z.string().optional(),
  tags: z.array(z.string()).max(10, "Pick at most 10 skills").optional(),
  resumeUrl: z.string().optional(),
});

export type ProfileFormInput = z.input<typeof profileFormSchema>;
export type ProfileFormValues = z.output<typeof profileFormSchema>;

export const profileFormDefaultValues = {
  yearsOfExperience: undefined,
  aboutMe: "",
  tags: [] as string[],
} satisfies ProfileFormInput;

export async function updateProfile(
  payload: ProfileFormValues,
): Promise<ApplicantProfile> {
  try {
    const response = await api.put("/applicant/profile", payload);
    return applicantProfileSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to save your profile.");
  }
}

export default updateProfile;
