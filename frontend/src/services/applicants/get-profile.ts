import { api, toErrorMessage } from "@/lib/http";
import {
  applicantProfileSchema,
  type ApplicantProfile,
} from "./applicant.schema";

export type { ApplicantProfile };

export default async function getProfile(): Promise<ApplicantProfile> {
  try {
    const response = await api.get("/applicant/profile");
    return applicantProfileSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to load your profile.");
  }
}
