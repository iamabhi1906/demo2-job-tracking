import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ApplicantProfile } from "./entities/applicant-profile.entity.js";
import { Tag } from "../tags/entities/tag.entity.js";
import { User } from "../users/entities/user.entity.js";
import type { UpdateProfileDto } from "./features/update-profile/update-profile.dto.js";

export type ApplicantProfileWithTags = ApplicantProfile & { tags: Tag[] };

@Injectable()
export class ApplicantsService {
	constructor(
		@InjectRepository(ApplicantProfile)
		private readonly profileRepository: Repository<ApplicantProfile>,
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async getOrCreateByFirebaseUid(firebaseUid: string): Promise<ApplicantProfile> {
		const user = await this.userRepository.findOne({ where: { firebaseUid } });
		if (!user) throw new NotFoundException("User not found");
		const existing = await this.profileRepository.findOne({ where: { userId: user.id } });
		if (existing) return existing;
		return this.profileRepository.save(this.profileRepository.create({ userId: user.id }));
	}

	async findByIdWithTags(id: string): Promise<ApplicantProfileWithTags> {
		const profile = await this.profileRepository.findOne({
			where: { id },
			relations: { tags: true, user: true },
		});
		if (!profile) throw new NotFoundException("Applicant profile not found");
		return profile as ApplicantProfileWithTags;
	}

	async findByFirebaseUidWithTags(firebaseUid: string): Promise<ApplicantProfileWithTags> {
		const profile = await this.getOrCreateByFirebaseUid(firebaseUid);
		return this.findByIdWithTags(profile.id);
	}

	async update(firebaseUid: string, dto: UpdateProfileDto): Promise<ApplicantProfileWithTags> {
		const profile = await this.getOrCreateByFirebaseUid(firebaseUid);
		profile.yearsOfExperience = dto.yearsOfExperience ?? null;
		profile.aboutMe = dto.aboutMe ?? null;
		profile.resumeUrl = dto.resumeUrl ?? null;
		if (dto.tags) {
			const tags = await this.tagRepository.find({ where: { name: In(dto.tags) } });
			profile.tags = tags;
		}
		await this.profileRepository.save(profile);
		return this.findByIdWithTags(profile.id);
	}
}
