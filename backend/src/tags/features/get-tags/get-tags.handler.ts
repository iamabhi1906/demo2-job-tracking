import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type FindOptionsWhere, Like, Repository } from "typeorm";
import { Tag } from "../../entities/tag.entity.js";
import { type GetTagsDto, getTagsSchema } from "./get-tags.dto.js";

@Injectable()
export class GetTagsHandler {
	constructor(
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
	) {}

	async get(dto: GetTagsDto) {
		const { page, limit, q } = getTagsSchema.parse(dto);
		const where: FindOptionsWhere<Tag> = {};

		if (q) where.name = Like(`%${q}%`);

		const [tags, total] = await this.tagRepository.findAndCount({
			where,
			take: limit,
			skip: page * limit,
			order: { name: "ASC" },
		});

		return { tags, total, page, limit };
	}
}
