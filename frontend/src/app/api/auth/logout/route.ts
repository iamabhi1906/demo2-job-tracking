import { NextResponse, type NextRequest } from "next/server";

import { ssrApi } from "@/lib/http";
import { copyCookies, SESSION_COOKIE_NAME } from "@/lib/cookies";

export async function POST(request: NextRequest) {
  const requestCookie = request.headers.get("cookie");
  const response = await destroyBackendSession(requestCookie);

  if (requestCookie?.includes(`${SESSION_COOKIE_NAME}=`)) {
    response.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  }

  return response;
}

export async function destroyBackendSession(requestCookie: string | null) {
  const config = requestCookie
    ? { headers: { cookie: requestCookie } }
    : undefined;
  try {
    const backendResponse = await ssrApi.post(
      "/auth/logout",
      undefined,
      config,
    );

    const response = NextResponse.json({ ok: true }, { status: 200 });
    if (backendResponse.status < 400) {
      copyCookies(response, backendResponse);
    }
    return response;
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
