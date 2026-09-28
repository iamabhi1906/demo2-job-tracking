import { ConsoleLogger, StandardSchemaValidationPipe, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import cookieParser from "cookie-parser";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		forceCloseConnections: true,
		logger: new ConsoleLogger({ colors: true, prefix: "demo-test" }),
	});
	app.use(cookieParser());
	if (process.env.NODE_ENV === "production") app.enableShutdownHooks();

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
	app.useGlobalPipes(new StandardSchemaValidationPipe());

	app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

	const port = Number(process.env.PORT ?? 3000);
	await app.listen(port, "0.0.0.0");
}

await bootstrap();
