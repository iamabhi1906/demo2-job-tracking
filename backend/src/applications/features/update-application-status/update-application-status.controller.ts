import { Body, Controller, Param, Patch, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { parseUuidParam } from "../../../infrastructure/http/parse-uuid-param.js";
import { type UpdateApplicationStatusDto, updateApplicationStatusSchema } from "./update-application-status.dto.js";
import { UpdateApplicationStatusHandler } from "./update-application-status.handler.js";

@Controller("applications/:applicationId")
export class UpdateApplicationStatusController {
	constructor(private readonly updateApplicationStatusHandler: UpdateApplicationStatusHandler) {}

	@Patch("status")
	async updateStatus(
		@Param("applicationId") applicationId: string,
		@Body({ schema: updateApplicationStatusSchema }) dto: UpdateApplicationStatusDto,
		@Req() request: Request,
	) {
		const user = request.user;
		if (!user) throw new UnauthorizedException();

		return this.updateApplicationStatusHandler.handle(parseUuidParam("Application id", applicationId), dto, user);
	}
}
