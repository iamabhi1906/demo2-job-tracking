import { Controller, Get, Param, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { parseUuidParam } from "../../../infrastructure/http/parse-uuid-param.js";
import { GetApplicationHistoryHandler } from "./get-application-history.handler.js";

@Controller("applications/:applicationId")
export class GetApplicationHistoryController {
	constructor(private readonly getApplicationHistoryHandler: GetApplicationHistoryHandler) {}

	@Get("status-history")
	async getStatusHistory(@Param("applicationId") applicationId: string, @Req() request: Request) {
		const user = request.user;
		if (!user) throw new UnauthorizedException();

		return this.getApplicationHistoryHandler.handle(parseUuidParam("Application id", applicationId), user);
	}
}
