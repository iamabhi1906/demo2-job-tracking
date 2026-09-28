import { api, toErrorMessage } from "@/lib/http";
import { type GetJobsDto, getJobsResponseSchema } from "./job.schema";

export type { GetJobsDto, Job, GetJobsResponse } from "./job.schema";

export default async function getJobs(dto: GetJobsDto = {}) {
  try {
    // Drop empty values: `?department=` would fail the backend's `.min(1)`.
    const params = Object.fromEntries(
      Object.entries(dto).filter(
        ([, value]) =>
          value !== undefined &&
          value !== "" &&
          (!Array.isArray(value) || value.length > 0),
      ),
    );

    const response = await api.get("/jobs", { params });
    return getJobsResponseSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to get jobs.");
  }
}
