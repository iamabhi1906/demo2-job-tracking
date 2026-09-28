import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import UserRole from "../enums/user-role.enums.js";
import { Job } from "../../jobs/entities/job.entity.js";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", unique: true })
	firebaseUid: string;

	@Column({ type: "varchar", unique: true, nullable: true })
	email: string | null;

	@Column({ type: "varchar", nullable: true })
  name: string | null;

  @Column({ type: "enum", default: "applicant", enum: UserRole })
  role: UserRole;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => Job, (job) => job.createdBy)
  jobs: Job[];
}
