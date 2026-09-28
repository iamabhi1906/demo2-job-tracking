import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FirebaseAuthError } from "firebase-admin/auth";
import { FirebaseService } from "../infrastructure/firebase/firebase.service.js";
import { DEFAULT_SESSION_COOKIE_TTL_MS } from "../infrastructure/firebase/session-cookie.js";
import { UsersService } from "../users/users.service.js";

@Injectable()
export class AuthService {
	private readonly sessionCookieTtlMs: number;

	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly usersService: UsersService,
		private readonly configService: ConfigService,
	) {
		this.sessionCookieTtlMs = Number(this.configService.get("SESSION_COOKIE_TTL_MS") ?? DEFAULT_SESSION_COOKIE_TTL_MS);
	}

	async createSession(idToken: string) {
    try {
			const decoded = await this.firebaseService.verifyIdToken(idToken);

			// if (!decoded.email_verified) {
			// 	return { emailVerified: false };
			// }

			const sessionCookie = await this.firebaseService.createSessionCookie(idToken, this.sessionCookieTtlMs);

			const user = await this.usersService.upsertUser({
				firebaseUid: decoded.uid,
				email: decoded.email ?? null,
				name: decoded.name ?? null,
			});

			return {
				emailVerified: true,
				sessionCookie,
				ttlMs: this.sessionCookieTtlMs,
				user,
			};
		} catch (error) {
			if (error instanceof FirebaseAuthError) {
				throw new UnauthorizedException("Invalid or expired token");
			}
			throw error;
		}
	}

	async logout(sessionCookie: string | undefined) {
		if (!sessionCookie) {
			return;
		}

		try {
			const decoded = await this.firebaseService.verifySessionCookie(sessionCookie, true);
			await this.firebaseService.revokeRefreshTokens(decoded.uid);
		} catch {
			// A stale or already-invalidated cookie should not block clearing it.
		}
	}
}
