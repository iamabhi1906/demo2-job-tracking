import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { type JobCreationDto, jobCreationSchema } from "./create-job.dto.js";
import { AdminGuard } from "../../../infrastructure/guards/admin.guard.js";

@Controller("jobs")
@UseGuards(AdminGuard)
export class CreateJobController {
	@Post()
	async createJob(@Body({ schema: jobCreationSchema }) job: JobCreationDto) {
		return job;
	}
}
