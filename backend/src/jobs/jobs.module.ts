import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "./entities/job.entity.js";
import { UsersModule } from "../users/users.module.js";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";
import { CreateJobController } from "./features/create-job/create-job.controller.js";
import { CreateJobHandler } from "./features/create-job/create-job.handler.js";
import { GetJobsController } from "./features/get-jobs/get-jobs.controller.js";
import { GetJobsHandler } from "./features/get-jobs/get-jobs.handler.js";
import { Tag } from "../tags/entities/tag.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Job, Tag]), UsersModule],
  controllers: [CreateJobController, GetJobsController],
  providers: [CreateJobHandler, GetJobsHandler],
  exports: [TypeOrmModule],
})
export class JobsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      { path: "jobs", method: RequestMethod.POST },
      { path: "jobs", method: RequestMethod.GET }
    );
	}
}
