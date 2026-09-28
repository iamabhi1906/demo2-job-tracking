import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tag } from "../../entities/tag.entity.js";

@Injectable()
export class CreateTagsHandler {
	constructor(
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
	) {}

	async add(name: string) {
		const normalized = name.trim().toLocaleLowerCase();
		const existing = await this.tagRepository.findOne({ where: { name: normalized } });

		if (existing) {
			throw new ConflictException(`Tag with name "${name}" already exists`);
		}

		const newTag = this.tagRepository.create({ name: normalized });
		await this.tagRepository.save(newTag);
		return newTag;
	}
}
