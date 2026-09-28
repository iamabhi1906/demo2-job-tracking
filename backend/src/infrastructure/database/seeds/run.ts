import dataSource from "../data-source.js";
import { adminUserSeedOptions, seedAdminUser } from "./admin-user.seed.js";

async function main() {
	const options = adminUserSeedOptions();

	await dataSource.initialize();
	try {
		const admin = await seedAdminUser(dataSource, options);
		console.log(`Seeded admin "${admin.name}" <${admin.email}> with uid ${admin.firebaseUid} and role ${admin.role}`);
	} finally {
		await dataSource.destroy();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
