import type { AxiosResponse } from "axios";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "session";

export function copyCookies(
  response: NextResponse,
  backendResponse: AxiosResponse,
) {
  const setCookie = backendResponse.headers["set-cookie"] ?? [];
  const values = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const value of values) {
    response.headers.append("set-cookie", value);
  }
}
