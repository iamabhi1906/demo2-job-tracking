import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { z } from "zod";
import { AdminGuard } from "../../../infrastructure/guards/admin.guard.js";
import { GetApplicantProfileHandler } from "./get-applicant-profile.handler.js";

const applicantIdSchema = z.uuid("Applicant id must be a uuid");

@Controller("applicants/:id/profile")
@UseGuards(AdminGuard)
export class GetApplicantProfileController {
	constructor(private readonly handler: GetApplicantProfileHandler) {}

	@Get()
	async getProfile(@Param("id") id: string) {
		return this.handler.handle(applicantIdSchema.parse(id));
	}
}
