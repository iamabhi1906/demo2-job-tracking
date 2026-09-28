import { api, type BackendErrorBody } from "@/lib/http";
import axios from "axios";
import { type GetJobsDto, getJobsResponseSchema } from "./job.schema";

export type { GetJobsDto, Job, GetJobsResponse } from "./job.schema";

export default async function getJobs(dto: GetJobsDto = {}) {
  try {
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
    if (axios.isAxiosError<BackendErrorBody>(error)) {
      const body = error.response?.data ?? null;
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : body?.message;
      throw new Error(message ?? "Failed to get jobs.");
    }
    throw error;
  }
}
