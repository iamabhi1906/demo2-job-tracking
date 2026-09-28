import { Controller, ForbiddenException, Param, Post, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { z } from "zod";
import { ApplyJobHandler } from "./apply-job.handler.js";

const jobIdSchema = z.uuid("Job id must be a uuid");

@Controller("jobs/:jobId/applications")
export class ApplyJobController {
	constructor(private readonly applyJobHandler: ApplyJobHandler) {}

	@Post()
	async apply(@Param("jobId") jobId: string, @Req() request: Request) {
		const user = request.user;
		if (!user) throw new UnauthorizedException();
		if (user.role !== "applicant") throw new ForbiddenException("Only applicants can apply to a job");

		return this.applyJobHandler.handle(jobIdSchema.parse(jobId), user);
	}
}
