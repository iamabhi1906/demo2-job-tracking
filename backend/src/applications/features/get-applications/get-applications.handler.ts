import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOptionsWhere, In, Like, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { ApplicantProfile } from "../../../applicants/entities/applicant-profile.entity.js";
import { allowedTransitionTargets } from "../../application-status.transitions.js";
import { Application } from "../../entities/application.entity.js";
import ActorRole from "../../enums/actor-role.enum.js";
import ApplicationStatus, { APPLICATION_STATUS_VALUES } from "../../enums/application-status.enum.js";
import { type GetApplicationsDto, getApplicationsSchema } from "./get-applications.dto.js";

const COLUMN_SORTS = {
	appliedAt: "appliedAt",
	status: "status",
} as const;

type ColumnSort = keyof typeof COLUMN_SORTS;


const STAGE_RANK: Record<ApplicationStatus, number> = APPLICATION_STATUS_VALUES.reduce(
	(rank, status, index) => {
		rank[status] = index;
		return rank;
	},
	{} as Record<ApplicationStatus, number>,
);

type RejectionCounts = Map<string, number>;

const countOf = (counts: RejectionCounts, applicantId: string): number => counts.get(applicantId) ?? 0;

@Injectable()
export class GetApplicationsHandler {
	constructor(
		@InjectRepository(Application)
		private readonly applicationRepository: Repository<Application>,
		@InjectRepository(ApplicantProfile)
		private readonly applicantProfileRepository: Repository<ApplicantProfile>,
	) {}

	async handle(rawDto: GetApplicationsDto) {
		const dto = getApplicationsSchema.parse(rawDto);

		const where = await this.buildWhere(dto);
		if (where === null) {
			return { applications: [], total: 0, page: dto.page, limit: dto.limit };
		}

		const total = await this.applicationRepository.count({ where });
		const rejectionCounts = await this.loadRejectionCounts(await this.applicantIdsFor(where));

		const pageRows = await this.pageOf(where, dto, rejectionCounts);
		const ids = pageRows.map((row) => row.id);

		if (ids.length === 0) {
			return { applications: [], total, page: dto.page, limit: dto.limit };
		}

		const rows = await this.applicationRepository.find({
			where: { id: In(ids) },
			relations: { job: true, applicant: { user: true } },
		});
	
		const byId = new Map(rows.map((row) => [row.id, row]));
		const tagsByApplicant = await this.loadTagsForPage(rows.map((row) => row.applicantId));

		return {
			applications: ids
				.map((applicationId) => byId.get(applicationId))
				.filter((row): row is Application => row !== undefined)
				.map((row) => ({
					id: row.id,
					status: row.status,
					appliedAt: row.appliedAt,
					updatedAt: row.updatedAt,
					job: row.job
						? {
								id: row.job.id,
								title: row.job.title,
								department: row.job.department,
								location: row.job.location,
								status: row.job.status,
							}
						: null,
					candidate: {
						applicantId: row.applicantId,
						name: row.applicant?.user?.name ?? null,
						email: row.applicant?.user?.email ?? null,
						yearsOfExperience: row.applicant?.yearsOfExperience ?? null,
						tags: tagsByApplicant.get(row.applicantId) ?? [],
					},
					rejectionCount: countOf(rejectionCounts, row.applicantId),
					allowedTransitions: allowedTransitionTargets(row.status, ActorRole.ADMIN),
				})),
			total,
			page: dto.page,
			limit: dto.limit,
		};
	}

	
	private async buildWhere(dto: GetApplicationsDto): Promise<FindOptionsWhere<Application>[] | null> {
		const where: FindOptionsWhere<Application> = {};

		if (dto.status?.length) {
			where.status = In([...dto.status]);
		}
		if (dto.jobId) {
			where.jobId = dto.jobId;
		}
		if (dto.appliedFrom && dto.appliedTo) {
			where.appliedAt = Between(dto.appliedFrom, dto.appliedTo);
		} else if (dto.appliedFrom) {
			where.appliedAt = MoreThanOrEqual(dto.appliedFrom);
		} else if (dto.appliedTo) {
			where.appliedAt = LessThanOrEqual(dto.appliedTo);
		}
		if (dto.tag?.length) {
			const tagged = await this.applicantProfileRepository.find({
				where: { tags: { name: In(dto.tag) } },
				select: { id: true },
			});
			const applicantIds = [...new Set(tagged.map((profile) => profile.id))];
			if (applicantIds.length === 0) return null;
			where.applicantId = In(applicantIds);
		}

		if (dto.minRejections !== undefined || dto.maxRejections !== undefined) {
			const candidateIds = await this.applicantIdsFor([where]);
			if (candidateIds.length === 0) return null;

			const counts = await this.loadRejectionCounts(candidateIds);
			const allowed = candidateIds.filter((applicantId) => {
				const rejections = countOf(counts, applicantId);
				if (dto.minRejections !== undefined && rejections < dto.minRejections) return false;
				if (dto.maxRejections !== undefined && rejections > dto.maxRejections) return false;
				return true;
			});
			if (allowed.length === 0) return null;
			where.applicantId = In(allowed);
		}

		if (dto.q) {
			const needle = `%${dto.q}%`;
			return [
				{ ...where, applicant: { user: { name: Like(needle) } } },
				{ ...where, applicant: { user: { email: Like(needle) } } },
				{ ...where, job: { title: Like(needle) } },
			];
		}

		return [where];
	}

	
	private async applicantIdsFor(where: FindOptionsWhere<Application>[]): Promise<string[]> {
		const rows = await this.applicationRepository.find({ where, select: { applicantId: true } });
		return [...new Set(rows.map((row) => row.applicantId))];
	}

	private async loadRejectionCounts(applicantIds: string[]): Promise<RejectionCounts> {
		if (applicantIds.length === 0) return new Map();

		const rejected = await this.applicationRepository.find({
			where: { applicantId: In(applicantIds), status: ApplicationStatus.REJECTED },
			select: { applicantId: true },
		});

		const counts: RejectionCounts = new Map();
		for (const row of rejected) {
			counts.set(row.applicantId, (counts.get(row.applicantId) ?? 0) + 1);
		}
		return counts;
	}

	private async pageOf(
		where: FindOptionsWhere<Application>[],
		dto: GetApplicationsDto,
		rejectionCounts: RejectionCounts,
	): Promise<Application[]> {
		const offset = dto.page * dto.limit;
		const columnSort = COLUMN_SORTS[dto.sortBy as ColumnSort];

		if (columnSort) {
			return this.applicationRepository.find({
				where,
				order: { [columnSort]: dto.sortOrder },
				skip: offset,
				take: dto.limit,
			});
		}

		const matched = await this.applicationRepository.find({ where });
		const direction = dto.sortOrder === "ASC" ? 1 : -1;

		matched.sort((left, right) => {
			if (dto.sortBy === "stage") {
				return (STAGE_RANK[left.status] - STAGE_RANK[right.status]) * direction;
			}
			return (countOf(rejectionCounts, left.applicantId) - countOf(rejectionCounts, right.applicantId)) * direction;
		});

		return matched.slice(offset, offset + dto.limit);
	}

	private async loadTagsForPage(applicantIds: string[]): Promise<Map<string, { id: string; name: string }[]>> {
		const unique = [...new Set(applicantIds)];
		if (!unique.length) return new Map();

		const profiles = await this.applicantProfileRepository.find({
			where: { id: In(unique) },
			relations: { tags: true },
		});

		return new Map(
			profiles.map((profile) => [profile.id, profile.tags.map((tag) => ({ id: tag.id, name: tag.name }))]),
		);
	}
}
