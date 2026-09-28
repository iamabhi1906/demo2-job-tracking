import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";
import { UsersModule } from "../users/users.module.js";
import { Tag } from "./entities/tag.entity.js";
import { CreateTagsController } from "./features/create-tags/create-tags.controller.js";
import { CreateTagsHandler } from "./features/create-tags/create-tags.handler.js";
import { GetTagsController } from "./features/get-tags/get-tags.controller.js";
import { GetTagsHandler } from "./features/get-tags/get-tags.handler.js";

@Module({
	// UsersModule is required because AuthMiddleware resolves UsersService to read the role.
	imports: [TypeOrmModule.forFeature([Tag]), UsersModule],
	controllers: [CreateTagsController, GetTagsController],
	providers: [CreateTagsHandler, GetTagsHandler],
	exports: [TypeOrmModule],
})
export class TagsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({ path: "tags", method: RequestMethod.POST });
	}
}
