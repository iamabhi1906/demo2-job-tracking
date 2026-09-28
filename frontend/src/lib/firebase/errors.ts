import { FirebaseError } from "firebase/app";

export function getFirebaseAuthError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/weak-password":
      return "Password is too weak.";

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/user-disabled":
      return "This account has been disabled.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    default:
      return "Something went wrong. Please try again.";
  }
}
