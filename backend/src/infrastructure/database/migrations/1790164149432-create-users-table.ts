import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateUsersTable1790164149432 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "users",
				columns: [
					{ name: "id", type: "uuid", isPrimary: true, isGenerated: true, generationStrategy: "uuid", },
					{ name: "firebaseUid", type: "varchar", isUnique: true, },
					{ name: "email", type: "varchar", isNullable: true, isUnique: true, },
					{ name: "name", type: "varchar", isNullable: true, },
					{ name: "role", type: "enum", enum: ["admin", "applicant"], default: "'applicant'"},
					{ name: "createdAt", type: "timestamptz", default: "now()", },
					{ name: "updatedAt", type: "timestamptz", default: "now()", },
				],
      }),
			true
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("users");
	}
}
