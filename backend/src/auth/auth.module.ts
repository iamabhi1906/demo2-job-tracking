import { type MiddlewareConsumer, Module, type NestModule, RequestMethod } from "@nestjs/common";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";

@Module({
	imports: [UsersModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.exclude(
				{ path: "auth/session", method: RequestMethod.POST },
				{ path: "auth/logout", method: RequestMethod.POST },
			)
			.forRoutes(AuthController);
	}
}
