import axios from "axios";

import { API_URL, NEXT_PUBLIC_API_URL } from "@/lib/config";

export const ssrApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const api = axios.create({
  baseURL: NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export interface BackendErrorBody {
  message?: string | string[];
  statusCode?: number;
  error?: string;
}

export function toErrorMessage(error: unknown, fallback: string): Error {
  if (axios.isAxiosError<BackendErrorBody>(error)) {
    const body = error.response?.data;
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message;
    return new Error(message ?? fallback);
  }
  return error instanceof Error ? error : new Error(fallback);
}
