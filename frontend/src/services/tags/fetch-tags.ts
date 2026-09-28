import axios from "axios";
import { api } from "@/lib/http";
import type { FetchTagsParams, FetchTagsResponse } from "./tag.type";

export async function fetchTags(
  params: FetchTagsParams = {},
): Promise<FetchTagsResponse> {
  const { page = 0, limit = 10, q } = params;

  try {
    const response = await api.get<FetchTagsResponse>("/tags", {
      params: { page, limit, ...(q ? { q } : {}) },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error("Failed to load tags.");
    }
    throw error;
  }
}

export default fetchTags;
