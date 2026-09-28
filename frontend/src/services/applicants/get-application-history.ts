import { api, toErrorMessage } from "@/lib/http";
import {
  type ApplicationHistoryResponse,
  applicationHistoryResponseSchema,
} from "./applicant.schema";

export type { ApplicationHistoryResponse };

export default async function getApplicationHistory(
  applicationId: string,
): Promise<ApplicationHistoryResponse> {
  try {
    const response = await api.get(
      `/applications/${applicationId}/status-history`,
    );
    return applicationHistoryResponseSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to load the application history.");
  }
}
