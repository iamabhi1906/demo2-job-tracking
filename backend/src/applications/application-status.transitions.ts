import ActorRole from "./enums/actor-role.enum.js";
import ApplicationStatus from "./enums/application-status.enum.js";

export interface TransitionRule {
	readonly allowedRoles: readonly ActorRole[];
	readonly ownerOnly: boolean;
}

export type StatusTransitions = Readonly<Partial<Record<ApplicationStatus, TransitionRule>>>;

const ADMIN_ONLY: TransitionRule = { allowedRoles: [ActorRole.ADMIN], ownerOnly: false };
const APPLICANT_ONLY: TransitionRule = { allowedRoles: [ActorRole.APPLICANT], ownerOnly: true };

export const APPLICATION_STATUS_TRANSITIONS: Readonly<Record<ApplicationStatus, StatusTransitions>> = {
	[ApplicationStatus.APPLIED]: {
		[ApplicationStatus.SHORTLISTED]: ADMIN_ONLY,
		[ApplicationStatus.REJECTED]: ADMIN_ONLY,
		[ApplicationStatus.WITHDRAWN]: APPLICANT_ONLY,
	},
	[ApplicationStatus.SHORTLISTED]: {
		[ApplicationStatus.INTERVIEW]: ADMIN_ONLY,
		[ApplicationStatus.REJECTED]: ADMIN_ONLY,
		[ApplicationStatus.WITHDRAWN]: APPLICANT_ONLY,
	},
	[ApplicationStatus.INTERVIEW]: {
		[ApplicationStatus.OFFER]: ADMIN_ONLY,
		[ApplicationStatus.REJECTED]: ADMIN_ONLY,
		[ApplicationStatus.WITHDRAWN]: APPLICANT_ONLY,
	},
	[ApplicationStatus.OFFER]: {
		[ApplicationStatus.HIRED]: ADMIN_ONLY,
		[ApplicationStatus.REJECTED]: ADMIN_ONLY,
		[ApplicationStatus.WITHDRAWN]: APPLICANT_ONLY,
	},
	[ApplicationStatus.HIRED]: {},
	[ApplicationStatus.REJECTED]: {},
	[ApplicationStatus.WITHDRAWN]: {},
};

export function isTerminalStatus(status: ApplicationStatus): boolean {
	return Object.keys(APPLICATION_STATUS_TRANSITIONS[status]).length === 0;
}

export function findTransitionRule(from: ApplicationStatus, to: ApplicationStatus): TransitionRule | undefined {
	return APPLICATION_STATUS_TRANSITIONS[from]?.[to];
}

export function allowedTransitionTargets(from: ApplicationStatus, role?: ActorRole | null): ApplicationStatus[] {
	const rules = APPLICATION_STATUS_TRANSITIONS[from] ?? {};
	return (Object.keys(rules) as ApplicationStatus[]).filter((target) =>
		role ? rules[target]?.allowedRoles.includes(role) : true,
	);
}
