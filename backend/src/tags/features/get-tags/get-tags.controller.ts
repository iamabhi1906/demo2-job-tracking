import { Controller, Get, Query } from "@nestjs/common";
import { type GetTagsDto, getTagsSchema } from "./get-tags.dto.js";
import { GetTagsHandler } from "./get-tags.handler.js";

@Controller("tags")
export class GetTagsController {
	constructor(private readonly getTagsHandler: GetTagsHandler) {}

	@Get()
	async getTags(@Query({ schema: getTagsSchema }) params: GetTagsDto) {
		return await this.getTagsHandler.get(params);
	}
}
