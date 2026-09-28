import { Injectable } from "@nestjs/common";
import { ApplicantsService } from "../../applicants.service.js";

@Injectable()
export class GetApplicantProfileHandler {
	constructor(private readonly applicantsService: ApplicantsService) {}

	async handle(applicantId: string) {
		return this.applicantsService.findByIdWithTags(applicantId);
	}
}
