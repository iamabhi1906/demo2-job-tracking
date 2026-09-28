import axios from "axios";

export class SessionError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "SessionError";
  }
}

interface BackendErrorBody {
  message?: string;
  statusCode?: number;
  error?: string;
}

export async function createSession(idToken: string) {
  try {
    const response = await axios.post("/api/auth/session", { idToken });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = (error.response?.data ?? null) as BackendErrorBody | null;
      throw new SessionError(
        body?.message ?? "Not able to create session.",
        error.response?.status ?? 0,
        body?.error,
      );
    }
    throw error;
  }
}

export async function destroySession() {
  try {
    await axios.post("/api/auth/logout");
  } catch {
    // best-effort
  }
}
