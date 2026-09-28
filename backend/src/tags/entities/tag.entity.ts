import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, UpdateDateColumn } from "typeorm";
import { Job } from "../../jobs/entities/job.entity.js";

@Entity("tags")
export class Tag {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	updatedAt: Date;

	@ManyToMany(
		() => Job,
		(job) => job.tags,
	)
	jobs!: Job[];
}
