import { Injectable } from "@nestjs/common";
import type { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { User } from "./entities/user.entity.js";

export interface UpsertUserInput {
	firebaseUid: string;
	email: string | null;
	name: string | null;
}

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async upsertUser(input: UpsertUserInput): Promise<User> {
		const existing = await this.userRepository.findOne({
			where: [{ firebaseUid: input.firebaseUid }, ...(input.email ? [{ email: input.email }] : [])],
		});

		if (existing) {
			existing.firebaseUid = input.firebaseUid;
			existing.email = input.email ?? existing.email;
			existing.name = input.name ?? existing.name;
			return this.userRepository.save(existing);
		}
		const newUser = this.userRepository.create(input);
		return await this.userRepository.save(newUser);
  }

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

	async findUserByFirebaseUid(firebaseUid: string): Promise<User | null> {
		return this.userRepository.findOne({ where: { firebaseUid } });
	}
}
