import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "../../entities/job.entity.js";
import JobStatus from "../../enums/job-status.enum.js";
import type { AuthUser } from "../../../types/express.js";

@Injectable()
export class GetJobHandler {
	constructor(
		@InjectRepository(Job)
		private readonly jobRepository: Repository<Job>,
	) {}

	async handle(jobId: string, user: AuthUser) {
		const job = await this.jobRepository.findOne({
			where: { id: jobId },
			relations: { tags: true, createdBy: true },
		});

    if (!job) throw new NotFoundException("Job not found");

		if (user.role !== "admin" && job.status !== JobStatus.Open) {
			throw new NotFoundException("Job not found");
		}

		return job;
	}
}
