import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import type { DataSource } from "typeorm";

import { User } from "../../../users/entities/user.entity.js";
import UserRole from "../../../users/enums/user-role.enums.js";

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Asdf@1234";
const DEFAULT_ADMIN_NAME = "Admin";

export interface AdminUserSeedOptions {
	email: string;
	password: string;
	name: string;
}

export function adminUserSeedOptions(): AdminUserSeedOptions {
	return {
		email: process.env.SEED_ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL,
		password: process.env.SEED_ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
		name: process.env.SEED_ADMIN_NAME || DEFAULT_ADMIN_NAME,
	};
}

export async function seedAdminUser(dataSource: DataSource, options: AdminUserSeedOptions): Promise<User> {
	const auth = getAuth(getFirebaseApp());
	const firebaseUser = await upsertFirebaseUser(auth, options);
	await auth.setCustomUserClaims(firebaseUser.uid, { role: UserRole.ADMIN });
	return upsertAdminRow(dataSource, firebaseUser.uid, options);
}

function getFirebaseApp() {
	if (getApps().length > 0) return getApps()[0];

	const projectId = process.env.FIREBASE_PROJECT_ID;
	const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
	const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

	if (!projectId || !clientEmail || !privateKey) {
		throw new Error("Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY");
	}

	return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

async function upsertFirebaseUser(auth: Auth, options: AdminUserSeedOptions) {
	const existing = await auth.getUserByEmail(options.email).catch(() => null);

	if (!existing) {
		return await auth.createUser({
			email: options.email,
			password: options.password,
			displayName: options.name,
			emailVerified: true,
		});
	}

	return await auth.updateUser(existing.uid, {
		password: options.password,
		displayName: options.name,
		emailVerified: true,
	});
}

async function upsertAdminRow(
	dataSource: DataSource,
	firebaseUid: string,
	options: AdminUserSeedOptions,
): Promise<User> {
	const userRepository = dataSource.getRepository(User);
	const existing = await userRepository.findOne({
		where: [{ firebaseUid }, { email: options.email }],
	});

	if (existing) {
		existing.firebaseUid = firebaseUid;
		existing.email = options.email;
		existing.name = options.name;
		existing.role = UserRole.ADMIN;
		return await userRepository.save(existing);
	}

	return await userRepository.save(
		userRepository.create({
			firebaseUid,
			email: options.email,
			name: options.name,
			role: UserRole.ADMIN,
		}),
	);
}
