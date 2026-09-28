import { Body, Controller, ForbiddenException, Get, Post, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { CreateSessionDto } from "./dto/create-session.dto.js";
import { SESSION_COOKIE_NAME } from "../infrastructure/firebase/session-cookie.js";
import { sessionCookieOptions } from "../infrastructure/firebase/session-cookie.js";

@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {}

	@Post("session")
	async createSession(@Body() body: CreateSessionDto, @Res({ passthrough: true }) response: Response) {
		const result = await this.authService.createSession(body.idToken);
		if (!result.emailVerified || !result.sessionCookie) {
			throw new ForbiddenException("Email not verified");
		}
		const secure = this.configService.get("NODE_ENV") === "production";
		response.cookie(SESSION_COOKIE_NAME, result.sessionCookie, sessionCookieOptions(secure, result.ttlMs));
		return result.user;
	}

	@Post("logout")
	async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
		await this.authService.logout(request.cookies?.[SESSION_COOKIE_NAME]);
		response.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
		return { ok: true };
	}

	@Get("me")
	me(@Req() request: Request) {
		return request.user;
	}
}
