export const SESSION_COOKIE_NAME = "session";

export const EMAIL_NOT_VERIFIED_CODE = "EMAIL_NOT_VERIFIED";

export const DEFAULT_SESSION_COOKIE_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export interface SessionCookieOptions {
	httpOnly: boolean;
	secure: boolean;
	sameSite: "lax";
	path: string;
	maxAge: number;
}

export function sessionCookieOptions(secure: boolean, ttlMs: number): SessionCookieOptions {
	return {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: ttlMs,
	};
}
