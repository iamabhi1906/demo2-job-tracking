import { IsString, MinLength } from "class-validator";

export class CreateSessionDto {
	@IsString()
	@MinLength(10)
	idToken: string;
}
