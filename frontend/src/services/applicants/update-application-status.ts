import { api, toErrorMessage } from "@/lib/http";
import {
  type ApplicationStatus,
  updateApplicationStatusResponseSchema,
} from "./applicant.schema";

export default async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  note?: string,
) {
  try {
    const response = await api.patch(`/applications/${applicationId}/status`, {
      status,
      ...(note?.trim() ? { note: note.trim() } : {}),
    });
    return updateApplicationStatusResponseSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to update the application status.");
  }
}
