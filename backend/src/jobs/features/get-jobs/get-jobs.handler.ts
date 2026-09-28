import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, ILike, In, LessThanOrEqual, MoreThanOrEqual, Repository } from "typeorm";
import { Job } from "../../entities/job.entity.js";
import { type GetJobsDto, getJobsSchema } from "./get-jobs.dto.js";
import EmploymentType from "../../enums/employment-type.enum.js";
import JobStatus from "../../enums/job-status.enum.js";
import type { AuthUser } from "../../../types/express.js";

const SORTABLE_COLUMNS = {
	createdDate: "createdAt",
	applicationDeadline: "applicationDeadline",
} as const;

@Injectable()
export class GetJobsHandler {
	constructor(
		@InjectRepository(Job)
		private readonly jobRepository: Repository<Job>,
	) {}

	async handle(dto: GetJobsDto, user: AuthUser) {
		const validated = getJobsSchema.parse(dto);
		const whereConditions: FindOptionsWhere<Job> = {};

		if (validated.department) whereConditions.department = validated.department;
		if (validated.employmentType) whereConditions.employmentType = validated.employmentType as EmploymentType;
		if (validated.location) whereConditions.location = validated.location;

		if (validated.minimumExperience !== undefined) {
			whereConditions.minimumExperience = LessThanOrEqual(validated.minimumExperience);
		}

		if (validated.q) {
			whereConditions.title = ILike(`%${validated.q}%`);
		}

		if (validated.tags?.length) {
			whereConditions.tags = {
				name: In(validated.tags.map((t) => t.toLowerCase())),
			};
		}

		if (user.role !== "admin") {
			whereConditions.status = JobStatus.Open;
		} else if (validated.status) {
			whereConditions.status = validated.status as JobStatus;
		}

		const orderColumn = SORTABLE_COLUMNS[validated.sortBy as keyof typeof SORTABLE_COLUMNS] || "createdAt";
		const skipValue = (validated.page ?? 0) * (validated.limit ?? 10);

		const [jobs, total] = await this.jobRepository.findAndCount({
			relations: {
				tags: true,
				createdBy: true,
			},
			where: whereConditions,
			order: {
				[orderColumn]: validated.sortOrder || "DESC",
			},
			skip: skipValue,
			take: validated.limit ?? 10,
		});

		return {
			jobs,
			total,
			page: validated.page ?? 0,
			limit: validated.limit ?? 10,
		};
	}
}
