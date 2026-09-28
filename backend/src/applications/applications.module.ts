import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "./entities/application.entity.js";
import { ApplicationStatusHistory } from "./entities/application-status-history.entity.js";
import { Job } from "../jobs/entities/job.entity.js";
import { ApplicantsModule } from "../applicants/applicants.module.js";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";
import { ApplyJobController } from "./features/apply-job/apply-job.controller.js";
import { ApplyJobHandler } from "./features/apply-job/apply-job.handler.js";
import { MyApplicationsController } from "./features/my-applications/my-applications.controller.js";
import { MyApplicationsHandler } from "./features/my-applications/my-applications.handler.js";
import { UsersModule } from "../users/users.module.js";

@Module({
	imports: [TypeOrmModule.forFeature([Application, ApplicationStatusHistory, Job]), ApplicantsModule, UsersModule],
	controllers: [ApplyJobController, MyApplicationsController],
	providers: [ApplyJobHandler, MyApplicationsHandler],
})
export class ApplicationsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "jobs/:jobId/applications", method: RequestMethod.POST },
				{ path: "applicant/applications", method: RequestMethod.GET },
			);
	}
}
