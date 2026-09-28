import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { AuthUser } from "../../../types/express.js";
import { UsersService } from "../../../users/users.service.js";
import { toActorRole } from "../../actor-role.js";
import {
	allowedTransitionTargets,
	findTransitionRule,
	isTerminalStatus,
} from "../../application-status.transitions.js";
import { Application } from "../../entities/application.entity.js";
import { ApplicationStatusHistory } from "../../entities/application-status-history.entity.js";
import ActorRole from "../../enums/actor-role.enum.js";
import ApplicationStatus, { APPLICATION_STATUS_LABELS } from "../../enums/application-status.enum.js";
import { type UpdateApplicationStatusDto, updateApplicationStatusSchema } from "./update-application-status.dto.js";

const ROLE_LABELS: Record<ActorRole, string> = {
	[ActorRole.ADMIN]: "admins",
	[ActorRole.APPLICANT]: "applicants",
	[ActorRole.SYSTEM]: "the system",
};

const label = (status: ApplicationStatus): string => APPLICATION_STATUS_LABELS[status];
const labelAll = (statuses: ApplicationStatus[]): string => statuses.map(label).join(", ");

@Injectable()
export class UpdateApplicationStatusHandler {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,
		private readonly usersService: UsersService,
	) {}

	async handle(rawApplicationId: string, rawDto: UpdateApplicationStatusDto, user: AuthUser) {
		const { status: toStatus, note } = updateApplicationStatusSchema.parse(rawDto);

		const actorRole = toActorRole(user.role);
		if (!actorRole)
			throw new ForbiddenException("Your account does not have a role that can change application status");

		const actorUser = await this.usersService.findUserByFirebaseUid(user.uid);
		if (!actorUser) throw new NotFoundException("User not found");

		return this.applicationRepository.manager.transaction(async (manager) => {
			const application = await manager.findOne(Application, {
				where: { id: rawApplicationId },
				relations: { applicant: { user: true }, job: true },
			});
			if (!application) throw new NotFoundException("Application not found");

			const fromStatus = application.status;
			const isOwner = application.applicant?.userId === actorUser.id;
			if (actorRole === ActorRole.APPLICANT && !isOwner) {
				throw new ForbiddenException("You can only act on your own application");
			}

			// a
			const rule = findTransitionRule(fromStatus, toStatus);
			if (!rule) {
				throw new ConflictException(
					isTerminalStatus(fromStatus)
						? `"${label(fromStatus)}" is a final status, so this application cannot move to "${label(toStatus)}"`
						: `An application cannot move from "${label(fromStatus)}" to "${label(toStatus)}". ` +
								`Allowed from "${label(fromStatus)}": ${labelAll(allowedTransitionTargets(fromStatus))}`,
				);
			}

			// b
			if (!rule.allowedRoles.includes(actorRole)) {
				throw new ForbiddenException(
					actorRole === ActorRole.ADMIN && rule.allowedRoles.includes(ActorRole.APPLICANT)
						? `An admin cannot withdraw an application on an applicant's behalf. ` +
								`${labelAll(allowedTransitionTargets(fromStatus, ActorRole.APPLICANT))} can only be triggered by the applicant themselves.`
						: `Only ${rule.allowedRoles.map((role) => ROLE_LABELS[role]).join(" or ")} can move an application to "${label(toStatus)}"`,
				);
			}
      if (rule.ownerOnly && !isOwner) {
        throw new ForbiddenException(`You can only change your own application to "${label(toStatus)}"`);
      }

			const { affected } = await manager.update(
				Application,
				{ id: application.id, status: fromStatus },
				{ status: toStatus },
			);

			if (!affected) {
				throw new ConflictException(
					"This application was updated by someone else while you were reviewing it. Reload and try again.",
				);
			}

			await manager.getRepository(ApplicationStatusHistory).save({
				applicationId: application.id,
				previousStatus: fromStatus,
				newStatus: toStatus,
				actorUserId: actorUser.id,
				actorRole,
				note: note?.length ? note : null,
			});

			const updated = await manager.findOne(Application, {
				where: { id: application.id },
				relations: { applicant: { user: true }, job: true },
			});

			return {
				application: updated,
				allowedTransitions: allowedTransitionTargets(toStatus, actorRole),
			};
		});
	}
}
