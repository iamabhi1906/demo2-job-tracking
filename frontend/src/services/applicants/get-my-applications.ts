import { api, toErrorMessage } from "@/lib/http";
import {
  myApplicationsResponseSchema,
  type Application,
} from "./applicant.schema";

export type { Application };

export default async function getMyApplications(): Promise<Application[]> {
  try {
    const response = await api.get("/applicant/applications");
    return myApplicationsResponseSchema.parse(response.data).applications;
  } catch (error) {
    throw toErrorMessage(error, "Failed to load your applications.");
  }
}
