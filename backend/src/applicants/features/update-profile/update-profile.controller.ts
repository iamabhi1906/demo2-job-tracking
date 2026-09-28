import { Body, Controller, Get, Put, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { ApplicantsService } from "../../applicants.service.js";
import { type UpdateProfileDto, updateProfileSchema } from "./update-profile.dto.js";

@Controller("applicant/profile")
export class UpdateProfileController {
  constructor(private readonly applicantsService: ApplicantsService) { }
	
	@Put()
	async updateProfile(@Body({ schema: updateProfileSchema }) dto: UpdateProfileDto, @Req() request: Request) {
		if (!request.user) throw new UnauthorizedException();
		return this.applicantsService.update(request.user.uid, dto);
	}
}
