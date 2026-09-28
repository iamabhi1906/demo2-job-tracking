import { Body, Controller, Post } from "@nestjs/common";
import { CreateTagsDto } from "./create-tags.dto.js";
import { CreateTagsHandler } from "./create-tags.handler.js";

@Controller("tags")
export class CreateTagsController {
	constructor(private readonly createTagsHandler: CreateTagsHandler) {}

	@Post()
	createTag(@Body() body: CreateTagsDto) {
		return this.createTagsHandler.add(body.name);
	}
}
