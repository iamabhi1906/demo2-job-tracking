import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { ApplicantProfile } from "../../applicants/entities/applicant-profile.entity.js";
import type { Job } from "../../jobs/entities/job.entity.js";
import type { ApplicationStatusHistory } from "./application-status-history.entity.js";
import ApplicationStatus from "../enums/application-status.enum.js";

@Entity("applications")
export class Application {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "uuid", name: "applicant_id" })
	applicantId: string;

	@ManyToOne("ApplicantProfile", (profile: ApplicantProfile) => profile.applications, { onDelete: "CASCADE" })
	@JoinColumn({ name: "applicant_id" })
	applicant!: ApplicantProfile;

	@Column({ type: "uuid", name: "job_id" })
	jobId: string;

	@ManyToOne("Job", { onDelete: "CASCADE" })
	@JoinColumn({ name: "job_id" })
	job!: Job;

	@Column({ type: "enum", enum: ApplicationStatus, name: "status", default: ApplicationStatus.APPLIED })
	status: ApplicationStatus;

	@Column({ type: "timestamptz", name: "applied_at", default: "now()" })
	appliedAt: Date;

	@UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
	updatedAt: Date;

	@OneToMany("ApplicationStatusHistory", (entry: ApplicationStatusHistory) => entry.application)
	statusHistory: ApplicationStatusHistory[];
}
