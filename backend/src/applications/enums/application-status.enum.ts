enum ApplicationStatus {
	APPLIED = "applied",
	SHORTLISTED = "shortlisted",
	INTERVIEW = "interview",
	OFFER = "offer",
	HIRED = "hired",
	REJECTED = "rejected",
	WITHDRAWN = "withdrawn",
}

export const APPLICATION_STATUS_VALUES = [
	ApplicationStatus.APPLIED,
	ApplicationStatus.SHORTLISTED,
	ApplicationStatus.INTERVIEW,
	ApplicationStatus.OFFER,
	ApplicationStatus.HIRED,
	ApplicationStatus.REJECTED,
	ApplicationStatus.WITHDRAWN,
] as const;

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
	[ApplicationStatus.APPLIED]: "Applied",
	[ApplicationStatus.SHORTLISTED]: "Shortlisted",
	[ApplicationStatus.INTERVIEW]: "Interview",
	[ApplicationStatus.OFFER]: "Offer",
	[ApplicationStatus.HIRED]: "Hired",
	[ApplicationStatus.REJECTED]: "Rejected",
	[ApplicationStatus.WITHDRAWN]: "Withdrawn",
};

export default ApplicationStatus;
