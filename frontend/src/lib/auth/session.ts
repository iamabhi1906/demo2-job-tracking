import { cookies } from "next/headers";

import { ssrApi } from "@/lib/http";
import { SESSION_COOKIE_NAME } from "../cookies";
import type { SessionUser } from "./session-user.type";

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const response = await ssrApi.get("/users/me", {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
      },
    });
    return response.data as SessionUser;
  } catch {
    return null;
  }
}
