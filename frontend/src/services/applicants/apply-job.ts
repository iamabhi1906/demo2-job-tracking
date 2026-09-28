import { api, toErrorMessage } from "@/lib/http";
import { z } from "zod";
import { applicationStatusSchema } from "./applicant.schema";

const appliedSchema = z.object({
  id: z.string(),
  status: applicationStatusSchema,
  appliedAt: z.coerce.date(),
});

export type AppliedApplication = z.infer<typeof appliedSchema>;

export default async function applyToJob(
  jobId: string,
): Promise<AppliedApplication> {
  try {
    const response = await api.post(`/jobs/${jobId}/applications`);
    return appliedSchema.parse(response.data);
  } catch (error) {
    throw toErrorMessage(error, "Failed to submit your application.");
  }
}
