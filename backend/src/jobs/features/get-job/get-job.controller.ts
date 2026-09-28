import { Controller, Get, Param, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { z } from "zod";
import { GetJobHandler } from "./get-job.handler.js";

const jobIdSchema = z.uuid("Job id must be a uuid");

@Controller("jobs")
export class GetJobController {
	constructor(private readonly getJobHandler: GetJobHandler) {}

	@Get(":id")
	async getJob(@Param("id") id: string, @Req() request: Request) {
		if (!request.user) throw new UnauthorizedException();

		return this.getJobHandler.handle(jobIdSchema.parse(id), request.user);
	}
}
