import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { UsersService } from "../../users.service.js";

@Injectable()
export class UserMeHandler {
	constructor(private readonly usersService: UsersService) {}

	async getMe(request: Request) {
		const authUser = request.user;

		if (!authUser) {
			throw new UnauthorizedException();
		}

		const user = await this.usersService.findUserByFirebaseUid(authUser.uid);

		if (!user) {
			throw new NotFoundException("User not found");
		}

		return user;
	}
}
