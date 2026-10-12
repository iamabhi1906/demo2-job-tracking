import { BadRequestException } from "@nestjs/common";
import { z } from "zod";

export function parseUuidParam(name: string, value: string): string {
	const result = z.uuid().safeParse(value);
	if (!result.success) throw new BadRequestException(`${name} must be a valid uuid`);
	return result.data;
}