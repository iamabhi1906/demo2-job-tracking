import { copyCookies } from "@/lib/cookies";
import { ssrApi } from "@/lib/http";
import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let body: { idToken?: unknown };

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof body.idToken !== "string" || body.idToken.length < 10) {
    return Response.json({ message: "idToken is required" }, { status: 400 });
  }

  return createBackendSession(body.idToken);
}

export async function createBackendSession(idToken: string) {
  try {
    const backendResponse = await ssrApi.post("/auth/session", { idToken });
    const response = NextResponse.json(backendResponse.data);
    copyCookies(response, backendResponse);
    return response;
  } catch (error) {
    console.log(
      "Backend error",
      axios.isAxiosError(error)
        ? (error.response?.data ?? error.response?.status)
        : error,
    );
    return toBackendErrorResponse(error, "Session could not be created");
  }
}

export function toBackendErrorResponse(
  error: unknown,
  fallbackMessage: string,
): NextResponse {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data;
    return NextResponse.json(data ?? { message: fallbackMessage }, {
      status: error.response.status,
    });
  }
  return NextResponse.json(
    { message: "Backend is unreachable" },
    { status: 503 },
  );
}
