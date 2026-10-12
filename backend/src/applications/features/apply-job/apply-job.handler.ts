import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "../../entities/application.entity.js";
import { ApplicationStatusHistory } from "../../entities/application-status-history.entity.js";
import { Job } from "../../../jobs/entities/job.entity.js";
import JobStatus from "../../../jobs/enums/job-status.enum.js";
import { ApplicantsService } from "../../../applicants/applicants.service.js";
import ActorRole from "../../enums/actor-role.enum.js";
import ApplicationStatus from "../../enums/application-status.enum.js";
import type { AuthUser } from "../../../types/express.js";

@Injectable()
export class ApplyJobHandler {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,
		@InjectRepository(Job)
		private readonly jobRepository: Repository<Job>,
		private readonly applicantsService: ApplicantsService,
	) {}

	async handle(jobId: string, user: AuthUser) {
		const job = await this.jobRepository.findOne({ where: { id: jobId } });
		if (!job) throw new NotFoundException("Job not found");

		if (job.status !== JobStatus.Open) {
			throw new ConflictException("This job is closed and is no longer accepting applications");
		}
		if (new Date() > job.applicationDeadline) {
			throw new ConflictException("The application deadline for this job has passed");
		}

		const profile = await this.applicantsService.getOrCreateByFirebaseUid(user.uid);

		const existing = await this.applicationRepository.findOne({
			where: { applicantId: profile.id, jobId },
    });
		
    if (existing) throw new ConflictException("You have already applied to this job");
		
		return this.applicationRepository.manager.transaction(async (manager) => {
			const saved = await manager.getRepository(Application).save(
				this.applicationRepository.create({
					applicantId: profile.id,
					jobId,
					status: ApplicationStatus.APPLIED,
				}),
			);

			await manager.getRepository(ApplicationStatusHistory).save({
				applicationId: saved.id,
				previousStatus: null,
				newStatus: ApplicationStatus.APPLIED,
				actorUserId: profile.userId,
				actorRole: ActorRole.APPLICANT,
				note: null,
			});

			return saved;
		});
	}
}
