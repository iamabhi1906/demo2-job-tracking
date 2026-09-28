import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeApplicationStatusHistoryImmutable1790675502000 implements MigrationInterface {
	private static readonly TRIGGER_NAME = "TRG_application_status_history_immutable";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE OR REPLACE FUNCTION application_status_history_is_immutable() RETURNS trigger AS $$
			BEGIN
				IF TG_OP = 'UPDATE' THEN
					RAISE EXCEPTION 'application_status_history rows are immutable and cannot be updated'
						USING ERRCODE = 'restrict_violation';
				END IF;

				IF EXISTS (SELECT 1 FROM applications WHERE id = OLD.application_id) THEN
					RAISE EXCEPTION 'application_status_history rows are immutable and cannot be deleted'
						USING ERRCODE = 'restrict_violation';
				END IF;

				RETURN OLD;
			END;
			$$ LANGUAGE plpgsql
		`);

		await queryRunner.query(`
			CREATE TRIGGER "${MakeApplicationStatusHistoryImmutable1790675502000.TRIGGER_NAME}"
			BEFORE UPDATE OR DELETE ON application_status_history
			FOR EACH ROW EXECUTE FUNCTION application_status_history_is_immutable()
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`DROP TRIGGER IF EXISTS "${MakeApplicationStatusHistoryImmutable1790675502000.TRIGGER_NAME}" ON application_status_history`,
		);
		await queryRunner.query("DROP FUNCTION IF EXISTS application_status_history_is_immutable()");
	}
}
