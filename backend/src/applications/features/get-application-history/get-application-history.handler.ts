import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { AuthUser } from "../../../types/express.js";
import { toActorRole } from "../../actor-role.js";
import { Application } from "../../entities/application.entity.js";
import { ApplicationStatusHistory } from "../../entities/application-status-history.entity.js";

@Injectable()
export class GetApplicationHistoryHandler {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,
		@InjectRepository(ApplicationStatusHistory)
		private readonly historyRepository: Repository<ApplicationStatusHistory>,
	) {}

	async handle(applicationId: string, user: AuthUser) {
		const actorRole = toActorRole(user.role);
		if (!actorRole) throw new ForbiddenException("Your account does not have a role that can view application history");

		const application = await this.applicationRepository.findOne({
			where: { id: applicationId },
			relations: { applicant: { user: true } },
		});
		if (!application) throw new NotFoundException("Application not found");

		if (actorRole !== "admin" && application.applicant?.user?.firebaseUid !== user.uid) {
			throw new ForbiddenException("You can only view the history of your own applications");
		}
		const history = await this.historyRepository.find({
			where: { applicationId },
			relations: { actorUser: true },
			order: { createdAt: "ASC" },
		});

		return {
			applicationId: application.id,
			status: application.status,
			history: history.map((entry) => ({
				id: entry.id,
				previousStatus: entry.previousStatus,
				newStatus: entry.newStatus,
				actorRole: entry.actorRole,
				actor: entry.actorUser
					? { id: entry.actorUser.id, name: entry.actorUser.name, email: entry.actorUser.email }
					: null,
				note: entry.note,
				createdAt: entry.createdAt,
			})),
		};
	}
}
