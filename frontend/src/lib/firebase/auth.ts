import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  // signOut,
  updateProfile,
} from "firebase/auth";

import { firebaseAuth } from "./client";

export async function registerWithEmail(
  name: string,
  email: string,
  password: string,
) {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  await updateProfile(credential.user, { displayName: name });
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email,
    password,
  );
  const user = credential.user;
  // if (!user.emailVerified) {
  //   await signOut(firebaseAuth);
  //   await sendEmailVerification(user);
  //   throw new Error("EMAIL_NOT_VERIFIED");
  // }
  return user;
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(firebaseAuth, email);
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(firebaseAuth, provider);
  return credential.user;
}
