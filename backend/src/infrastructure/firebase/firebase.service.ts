import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

@Injectable()
export class FirebaseService {
	readonly auth: Auth;

	constructor(configService: ConfigService) {
		const projectId = configService.getOrThrow<string>("FIREBASE_PROJECT_ID");
		const clientEmail = configService.getOrThrow<string>("FIREBASE_CLIENT_EMAIL");
		const privateKey = configService.getOrThrow<string>("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");

		const app =
			getApps().length > 0
				? getApps()[0]
				: initializeApp({
						credential: cert({ projectId, clientEmail, privateKey }),
					});

		this.auth = getAuth(app);
	}

	verifyIdToken(token: string) {
		return this.auth.verifyIdToken(token);
	}

	verifySessionCookie(sessionCookie: string, checkRevoked = true) {
		return this.auth.verifySessionCookie(sessionCookie, checkRevoked);
	}

	createSessionCookie(idToken: string, expiresInMs: number) {
		return this.auth.createSessionCookie(idToken, { expiresIn: expiresInMs });
	}

	revokeRefreshTokens(uid: string) {
		return this.auth.revokeRefreshTokens(uid);
	}

	getUser(uid: string) {
		return this.auth.getUser(uid);
	}

	getUserByEmail(email: string) {
		return this.auth.getUserByEmail(email);
	}
}
