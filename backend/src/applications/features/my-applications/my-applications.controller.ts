import { Controller, Get, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { MyApplicationsHandler } from "./my-applications.handler.js";

@Controller("applicant/applications")
export class MyApplicationsController {
	constructor(private readonly myApplicationsHandler: MyApplicationsHandler) {}

	@Get()
	async getMyApplications(@Req() request: Request) {
		if (!request.user) throw new UnauthorizedException();

		return this.myApplicationsHandler.handle(request.user);
	}
}
