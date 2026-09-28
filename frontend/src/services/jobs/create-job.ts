import type { JobCreationSchemaOutput } from "@/app/admin/jobs/create/_schema/job-creation.schema";
import { api, type BackendErrorBody } from "@/lib/http";
import axios from "axios";

export default async function createJob(values: JobCreationSchemaOutput) {
  try {
    const response = await api.post("/jobs", values);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<BackendErrorBody>(error)) {
      const body = error.response?.data ?? null;
      const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : body?.message;
      throw new Error(message ?? "Failed to create job.");
    }
    throw error;
  }
}
