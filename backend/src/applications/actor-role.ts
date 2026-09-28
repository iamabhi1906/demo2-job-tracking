import ActorRole from "./enums/actor-role.enum.js";
import UserRole from "../users/enums/user-role.enums.js";

export function toActorRole(role: UserRole | null | undefined): ActorRole | null {
	if (role === UserRole.ADMIN) return ActorRole.ADMIN;
	if (role === UserRole.APPLICANT) return ActorRole.APPLICANT;
	return null;
}
