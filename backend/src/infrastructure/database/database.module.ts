import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { User } from "../../users/entities/user.entity.js";
import { Job } from "../../jobs/entities/job.entity.js";
import { Tag } from "../../tags/entities/tag.entity.js";

@Global()
@Module({
	providers: [
		{
			provide: DataSource,
			useFactory: async (configService: ConfigService) => {
				const dataSource = new DataSource({
					type: "postgres",
					host: configService.getOrThrow<string>("POSTGRES_HOST"),
					port: Number(configService.getOrThrow<string>("POSTGRES_PORT")),
					username: configService.getOrThrow<string>("POSTGRES_USER"),
					password: configService.getOrThrow<string>("POSTGRES_PASSWORD"),
					database: configService.getOrThrow<string>("POSTGRES_DB"),
					entities: [User, Job, Tag],
					synchronize: false,
				});

				await dataSource.initialize();

				return dataSource;
			},
			inject: [ConfigService],
		},
	],
	exports: [DataSource],
})
export class DatabaseModule {}
