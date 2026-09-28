import { api, toErrorMessage } from "@/lib/http";
import {
  type ApplicationStatus,
  adminApplicationsResponseSchema,
  type AdminApplicationsResponse,
} from "./applicant.schema";

export interface AdminApplicationsParams {
  q?: string;
  status?: ApplicationStatus[] | string;
  jobId?: string;
  appliedFrom?: string;
  appliedTo?: string;
  tag?: string[];
  minRejections?: number;
  maxRejections?: number;
  sortBy?: "appliedAt" | "rejectionCount" | "status" | "stage";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export type { AdminApplicationsResponse };

export default async function getAdminApplications(
  params: AdminApplicationsParams = {},
): Promise<AdminApplicationsResponse> {
  try {
    const query = Object.fromEntries(
      Object.entries(params).filter(([, value]) => {
        if (value === undefined || value === "") return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      }),
    );
    const response = await api.get("/applications", { params: query });
    return adminApplicationsResponseSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to load applications.");
  }
}
