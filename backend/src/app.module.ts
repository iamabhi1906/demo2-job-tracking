import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { AuthModule } from "./auth/auth.module.js";
import { DatabaseModule } from "./infrastructure/database/database.module.js";
import { FirebaseModule } from "./infrastructure/firebase/firebase.module.js";
import { JobsModule } from "./jobs/jobs.module.js";
import { UsersModule } from "./users/users.module.js";
import { TagsModule } from "./tags/tags.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		FirebaseModule,
		AuthModule,
		UsersModule,
		JobsModule,
		TagsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
