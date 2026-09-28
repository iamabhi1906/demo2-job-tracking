import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import type { Application } from "../../applications/entities/application.entity.js";
import type { Tag } from "../../tags/entities/tag.entity.js";
import type { User } from "../../users/entities/user.entity.js";

@Entity("applicant_profiles")
export class ApplicantProfile {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "uuid", name: "user_id", unique: true })
	userId: string;

	@ManyToOne("User", { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user!: User;

	@Column({ type: "numeric", name: "years_of_experience", precision: 4, scale: 1, nullable: true })
	yearsOfExperience: number | null;

	@Column({ type: "varchar", name: "resume_url", nullable: true })
	resumeUrl: string | null;

	@Column({ type: "text", name: "about_me", nullable: true })
	aboutMe: string | null;

	@ManyToMany("Tag", { onDelete: "CASCADE" })
	@JoinTable({
		name: "applicant_tags",
		joinColumn: { name: "applicant_id", referencedColumnName: "id" },
		inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
	})
	tags: Tag[];

	@OneToMany("Application", (application: Application) => application.applicant)
	applications: Application[];

	@CreateDateColumn({ type: "timestamptz", name: "created_at" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
	updatedAt: Date;
}
