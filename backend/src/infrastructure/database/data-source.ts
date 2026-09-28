import { DataSource, type DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

export const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: process.env.POSTGRES_HOST || "localhost",
	port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
	username: process.env.POSTGRES_USER || "postgres",
	password: process.env.POSTGRES_PASSWORD || "postgres",
	database: process.env.POSTGRES_DB || "shipment_db",
	synchronize: false,
	migrationsTableName: "migrations",
	entities: [`${__dirname}/../../**/*.entity.js`],
	migrations: [`${__dirname}/migrations/*.js`],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
