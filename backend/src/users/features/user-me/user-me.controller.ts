import { Controller, Get, Req } from "@nestjs/common";
import type { Request } from "express";
import { UserMeHandler } from "./user-me.handler.js";

@Controller("users/me")
export class UserMeController {
	constructor(private readonly userMeHandler: UserMeHandler) {}

	@Get()
	me(@Req() request: Request) {
		return this.userMeHandler.getMe(request);
	}
}
