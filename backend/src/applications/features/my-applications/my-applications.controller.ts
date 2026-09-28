import { Controller, Get, Query, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { type MyApplicationsDto, myApplicationsSchema } from "./my-applications.dto.js";
import { MyApplicationsHandler } from "./my-applications.handler.js";

@Controller("applicant/applications")
export class MyApplicationsController {
	constructor(private readonly myApplicationsHandler: MyApplicationsHandler) {}

	@Get()
	async getMyApplications(@Query({ schema: myApplicationsSchema }) query: MyApplicationsDto, @Req() request: Request) {
		if (!request.user) throw new UnauthorizedException();

		return this.myApplicationsHandler.handle(query, request.user);
	}
}
