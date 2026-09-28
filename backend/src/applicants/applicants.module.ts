import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApplicantProfile } from "./entities/applicant-profile.entity.js";
import { Tag } from "../tags/entities/tag.entity.js";
import { User } from "../users/entities/user.entity.js";
import { AuthMiddleware } from "../infrastructure/middlewares/auth.middleware.js";
import { ApplicantsService } from "./applicants.service.js";
import { GetApplicantProfileController } from "./features/get-applicant-profile/get-applicant-profile.controller.js";
import { GetApplicantProfileHandler } from "./features/get-applicant-profile/get-applicant-profile.handler.js";
import { UpdateProfileController } from "./features/update-profile/update-profile.controller.js";
import { UsersModule } from "../users/users.module.js";

@Module({
	imports: [TypeOrmModule.forFeature([ApplicantProfile, Tag, User]), UsersModule],
	controllers: [UpdateProfileController, GetApplicantProfileController],
	providers: [ApplicantsService, GetApplicantProfileHandler],
	exports: [ApplicantsService],
})
export class ApplicantsModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "applicant/profile", method: RequestMethod.GET },
				{ path: "applicant/profile", method: RequestMethod.PUT },
				{ path: "applicants/:id/profile", method: RequestMethod.GET },
			);
	}
}
