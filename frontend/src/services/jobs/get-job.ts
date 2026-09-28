import { api, toErrorMessage } from "@/lib/http";
import { jobSchema, type Job } from "./job.schema";

export type { Job };

export default async function getJob(jobId: string): Promise<Job> {
  try {
    const response = await api.get(`/jobs/${jobId}`);
    return jobSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to load this job.");
  }
}
