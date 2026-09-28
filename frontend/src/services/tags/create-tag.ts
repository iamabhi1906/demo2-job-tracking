import axios from "axios";
import { api } from "@/lib/http";
import type { Tag } from "./tag.type";

export async function createTag(name: string): Promise<Tag> {
  try {
    const response = await api.post<Tag>("/tags", { name });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string } | undefined)?.message ??
        "Failed to create tag.";
      throw new Error(message);
    }
    throw error;
  }
}

export default createTag;
