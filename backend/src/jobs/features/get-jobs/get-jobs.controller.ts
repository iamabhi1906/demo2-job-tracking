import { Controller, Get, Query, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { type GetJobsDto, getJobsSchema } from "./get-jobs.dto.js";
import { GetJobsHandler } from "./get-jobs.handler.js";

@Controller("jobs")
export class GetJobsController {
	constructor(private readonly getJobsHandler: GetJobsHandler) {}

	@Get()
	async getJobs(@Query({ schema: getJobsSchema }) query: GetJobsDto, @Req() request: Request) {
		if (!request.user) throw new UnauthorizedException();

		return this.getJobsHandler.handle(query, request.user);
	}
}
