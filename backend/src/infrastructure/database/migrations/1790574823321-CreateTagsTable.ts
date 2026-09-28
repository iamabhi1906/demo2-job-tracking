import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTagsTable1790574823321 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "tags",
				columns: [
					{ name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid" },
					{ name: "name", type: "varchar", isUnique: true },
					{ name: "createdAt", type: "timestamptz", default: "now()" },
					{ name: "updatedAt", type: "timestamptz", default: "now()" },
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("tags");
	}
}
