import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Application } from "../../entities/application.entity.js";
import { ApplicantsService } from "../../../applicants/applicants.service.js";
import type { AuthUser } from "../../../types/express.js";

@Injectable()
export class MyApplicationsHandler {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,
		private readonly applicantsService: ApplicantsService,
	) {}

	async handle(user: AuthUser) {
		const profile = await this.applicantsService.getOrCreateByFirebaseUid(user.uid);
		const applications = await this.applicationRepository.find({
			where: { applicantId: profile.id },
			relations: { job: { tags: true } },
			order: { appliedAt: "DESC" },
		});

		return { applications };
	}
}
