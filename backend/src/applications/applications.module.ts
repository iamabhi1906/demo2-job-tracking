import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Application } from "./entities/application.entity.js";
import { ApplicationStatusHistory } from "./entities/application-status-history.entity.js";
import { Job } from "../jobs/entities/job.entity.js";
import { ApplicantProfile } from "../applicants/entities/applicant-profile.entity.js";
import { ApplicantsModule } from "../applicants/applicants.module.js";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";
import { ApplyJobController } from "./features/apply-job/apply-job.controller.js";
import { ApplyJobHandler } from "./features/apply-job/apply-job.handler.js";
import { MyApplicationsController } from "./features/my-applications/my-applications.controller.js";
import { MyApplicationsHandler } from "./features/my-applications/my-applications.handler.js";
import { GetApplicationsController } from "./features/get-applications/get-applications.controller.js";
import { GetApplicationsHandler } from "./features/get-applications/get-applications.handler.js";
import { GetApplicationHistoryController } from "./features/get-application-history/get-application-history.controller.js";
import { GetApplicationHistoryHandler } from "./features/get-application-history/get-application-history.handler.js";
import { UpdateApplicationStatusController } from "./features/update-application-status/update-application-status.controller.js";
import { UpdateApplicationStatusHandler } from "./features/update-application-status/update-application-status.handler.js";
import { UsersModule } from "../users/users.module.js";

@Module({
	imports: [
		TypeOrmModule.forFeature([Application, ApplicationStatusHistory, Job, ApplicantProfile]),
		ApplicantsModule,
		UsersModule,
	],
	controllers: [
		ApplyJobController,
		MyApplicationsController,
		GetApplicationsController,
		GetApplicationHistoryController,
		UpdateApplicationStatusController,
	],
	providers: [
		ApplyJobHandler,
		MyApplicationsHandler,
		GetApplicationsHandler,
		GetApplicationHistoryHandler,
		UpdateApplicationStatusHandler,
	],
})
export class ApplicationsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "jobs/:jobId/applications", method: RequestMethod.POST },
				{ path: "applicant/applications", method: RequestMethod.GET },
				{ path: "applications", method: RequestMethod.GET },
				{ path: "applications/:applicationId/status", method: RequestMethod.PATCH },
				{ path: "applications/:applicationId/status-history", method: RequestMethod.GET },
			);
	}
}
