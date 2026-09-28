import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { type JobCreationDto, jobCreationSchema } from "./create-job.dto.js";
import { AdminGuard } from "../../../infrastructure/guards/admin.guard.js";
import { CreateJobHandler } from "./create-job.handler.js";

@Controller("jobs")
@UseGuards(AdminGuard)
export class CreateJobController {
  constructor(private readonly createJobHandler: CreateJobHandler) { }

	@Post()
	async createJob(@Body({ schema: jobCreationSchema }) job: JobCreationDto) {
		return this.createJobHandler.handle(job);
	}
}
