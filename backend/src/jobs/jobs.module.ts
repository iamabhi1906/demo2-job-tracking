import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "./entities/job.entity.js";
import { CreateJobModule } from "./features/create-job/create-job.module.js";

@Module({
	imports: [TypeOrmModule.forFeature([Job]), forwardRef(() => CreateJobModule)],
	exports: [TypeOrmModule],
})
export class JobsModule {}
