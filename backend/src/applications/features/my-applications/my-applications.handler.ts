import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ApplicantsService } from "../../../applicants/applicants.service.js";
import type { AuthUser } from "../../../types/express.js";
import { allowedTransitionTargets } from "../../application-status.transitions.js";
import { Application } from "../../entities/application.entity.js";
import ActorRole from "../../enums/actor-role.enum.js";
import { type MyApplicationsDto, myApplicationsSchema } from "./my-applications.dto.js";

@Injectable()
export class MyApplicationsHandler {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,
		private readonly applicantsService: ApplicantsService,
	) {}

	async handle(rawDto: MyApplicationsDto, user: AuthUser) {
		const dto = myApplicationsSchema.parse(rawDto);
		const profile = await this.applicantsService.getOrCreateByFirebaseUid(user.uid);

		const [applications, total] = await this.applicationRepository.findAndCount({
			where: {
				applicantId: profile.id,
				...(dto.status ? { status: dto.status } : {}),
				...(dto.jobId ? { jobId: dto.jobId } : {}),
			},
			relations: { job: { tags: true } },
			order: { appliedAt: "DESC" },
			skip: dto.page * dto.limit,
			take: dto.limit,
		});

		return {
			applications: applications.map((application) => ({
				id: application.id,
				status: application.status,
				appliedAt: application.appliedAt,
				updatedAt: application.updatedAt,
				job: application.job,
				allowedTransitions: allowedTransitionTargets(application.status, ActorRole.APPLICANT),
			})),
			total,
			page: dto.page,
			limit: dto.limit,
		};
	}
}
