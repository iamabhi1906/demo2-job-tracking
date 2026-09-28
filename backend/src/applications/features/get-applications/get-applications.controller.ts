import { Controller, Get, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AdminGuard } from "../../../infrastructure/guards/admin.guard.js";
import { type GetApplicationsDto, getApplicationsSchema } from "./get-applications.dto.js";
import { GetApplicationsHandler } from "./get-applications.handler.js";

@Controller("applications")
@UseGuards(AdminGuard)
export class GetApplicationsController {
	constructor(private readonly getApplicationsHandler: GetApplicationsHandler) {}

	@Get()
	async getApplications(@Query({ schema: getApplicationsSchema }) query: GetApplicationsDto, @Req() request: Request) {
		if (!request.user) throw new UnauthorizedException();

		return this.getApplicationsHandler.handle(query);
	}
}
