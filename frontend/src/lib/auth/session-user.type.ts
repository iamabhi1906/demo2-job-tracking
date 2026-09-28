export enum UserRole {
  ADMIN = "admin",
  APPLICANT = "applicant",
}

export interface SessionUser {
  uid: string;
  email: string | null;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  roles?: string[];
}
