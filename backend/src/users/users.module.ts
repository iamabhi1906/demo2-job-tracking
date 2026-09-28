import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { User } from "./entities/user.entity.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserMeController } from "./features/user-me/user-me.controller.js";
import { UserMeHandler } from "./features/user-me/user-me.handler.js";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
	controllers: [UserMeController],
	providers: [UsersService, UserMeHandler],
	exports: [UsersService],
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({ path: "users/me", method: RequestMethod.GET });
	}
}
