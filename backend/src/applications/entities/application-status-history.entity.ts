import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { User } from "../../users/entities/user.entity.js";
import type { Application } from "./application.entity.js";
import ActorRole from "../enums/actor-role.enum.js";
import ApplicationStatus from "../enums/application-status.enum.js";

@Entity("application_status_history")
export class ApplicationStatusHistory {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "uuid", name: "application_id" })
	applicationId: string;

	@ManyToOne("Application", (application: Application) => application.statusHistory, { onDelete: "CASCADE" })
	@JoinColumn({ name: "application_id" })
	application!: Application;

	@Column({ type: "enum", enum: ApplicationStatus, name: "previous_status", nullable: true })
	previousStatus: ApplicationStatus | null;

	@Column({ type: "enum", enum: ApplicationStatus, name: "new_status" })
	newStatus: ApplicationStatus;

	@Column({ type: "uuid", name: "actor_user_id", nullable: true })
	actorUserId: string | null;

	@ManyToOne("User", { onDelete: "SET NULL", nullable: true })
	@JoinColumn({ name: "actor_user_id" })
	actorUser!: User | null;

	@Column({ type: "enum", enum: ActorRole, name: "actor_role" })
	actorRole: ActorRole;

	@Column({ type: "text", nullable: true })
	note: string | null;

	@CreateDateColumn({ type: "timestamptz", name: "created_at" })
	createdAt: Date;
}
