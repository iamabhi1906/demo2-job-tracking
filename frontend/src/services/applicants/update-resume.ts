import { api, toErrorMessage } from "@/lib/http";
import {
  applicantProfileSchema,
  type ApplicantProfile,
} from "./applicant.schema";

export async function updateResume(
  resumeUrl: string,
): Promise<ApplicantProfile> {
  try {
    const response = await api.put("/applicant/profile/resume", { resumeUrl });
    return applicantProfileSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to save your resume.");
  }
}
