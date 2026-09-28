import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import EmploymentType from "../enums/employment-type.enum.js";
import JobStatus from "../enums/job-status.enum.js";
import { Tag } from "../../tags/entities/tag.entity.js";
import type { User } from "../../users/entities/user.entity.js";

@Entity("jobs")
export class Job {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar" })
	title: string;

	@Column({ type: "varchar", nullable: true })
	department: string | null;

	@Column({ type: "varchar", nullable: true })
	location: string | null;

	@Column({ type: "enum", enum: EmploymentType, name: "employment_type" })
	employmentType: EmploymentType;

	@Column({ type: "decimal", name: "minimum_experience" })
	minimumExperience: number;

	@Column({ type: "timestamptz", name: "application_deadline" })
	applicationDeadline: Date;

	@Column({ type: "enum", enum: JobStatus, name: "status" })
	status: JobStatus;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt: Date;

	@ManyToOne<User>("users", (user) => user.jobs)
	@JoinColumn({ name: "created_by" })
	createdBy!: User | null;

	@ManyToMany(
		() => Tag,
		(tag) => tag.jobs,
	)
	@JoinTable({
		name: "jobs_tags",
		joinColumn: { name: "job_id" },
		inverseJoinColumn: { name: "tag_id" },
	})
	tags!: Tag[];
}
