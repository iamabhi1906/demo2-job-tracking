import { type MiddlewareConsumer, forwardRef, Module, type NestModule, RequestMethod } from "@nestjs/common";
import { AdminGuard } from "../../../infrastructure/guards/admin.guard.js";
import { AuthMiddleware } from "../../../infrastructure/middlewares/auth.middleware.js";
import { UsersModule } from "../../../users/users.module.js";
import { JobsModule } from "../../jobs.module.js";
import { CreateJobController } from "./create-job.controller.js";

@Module({
	imports: [forwardRef(() => JobsModule), UsersModule],
	controllers: [CreateJobController],
	providers: [AdminGuard],
})
export class CreateJobModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({ path: "jobs", method: RequestMethod.POST });
	}
}
