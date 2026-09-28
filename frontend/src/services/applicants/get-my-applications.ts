import { api, toErrorMessage } from "@/lib/http";
import {
  type ApplicationStatus,
  myApplicationsResponseSchema,
  type MyApplicationsResponse,
} from "./applicant.schema";

export interface MyApplicationsParams {
  status?: ApplicationStatus;
  jobId?: string;
  page?: number;
  limit?: number;
}

export type { MyApplicationsResponse };

export default async function getMyApplications(
  params: MyApplicationsParams = {},
): Promise<MyApplicationsResponse> {
  try {
    const query = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== "",
      ),
    );
    const response = await api.get("/applicant/applications", {
      params: query,
    });
    return myApplicationsResponseSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to load your applications.");
  }
}
