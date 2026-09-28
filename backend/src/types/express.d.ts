import UserRole from "../users/enums/user-role.enums.ts";

export interface AuthUser {
	uid: string;
	email: string | null;
	name: string | null;
	emailVerified: boolean;
		role?: UserRole | null;
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthUser;
			cookies?: Record<string, string>;
		}
	}
}
