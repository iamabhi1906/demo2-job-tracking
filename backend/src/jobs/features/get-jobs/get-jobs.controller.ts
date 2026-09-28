import { Controller, Get, Query } from "@nestjs/common";
import {
	type GetJobsDto,
	getJobsSchema,
} from "./get-jobs.dto.js";
import { GetJobsHandler } from "./get-jobs.handler.js";

@Controller("jobs")
export class GetJobsController {
	constructor(private readonly getJobsHandler: GetJobsHandler) {}

	@Get()
	async getJobs(@Query({ schema: getJobsSchema }) query: GetJobsDto) {
    return this.getJobsHandler.handle(query);
	}
}
