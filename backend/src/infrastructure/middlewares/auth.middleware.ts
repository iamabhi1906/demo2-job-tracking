import { type NestMiddleware, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { FirebaseService } from "../firebase/firebase.service.js";
import { SESSION_COOKIE_NAME } from "../firebase/session-cookie.js";
import { UsersService } from "../../users/users.service.js";
import type UserRole from "../../users/enums/user-role.enums.js";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly firebaseService: FirebaseService,
		private readonly usersService: UsersService,
	) {}

  async use(request: Request, _response: Response, next: NextFunction) {
    const sessionCookie = request.cookies?.[SESSION_COOKIE_NAME];

    if (!sessionCookie) throw new UnauthorizedException();

		try {
			const decoded = await this.firebaseService.verifySessionCookie(sessionCookie, true);
			if (!decoded.email_verified) throw new ForbiddenException("Email not verified");

			const user = await this.usersService.findUserByFirebaseUid(decoded.uid);

			request.user = {
				uid: decoded.uid,
				email: decoded.email || null,
				name: decoded.name || null,
				emailVerified: decoded.email_verified === true,
				role: user?.role ?? (decoded.role as UserRole | undefined) ?? null,
			};

			next();
		} catch (error) {
			if (error instanceof ForbiddenException) {
				throw error;
			}
			throw new UnauthorizedException();
		}
  }
}
