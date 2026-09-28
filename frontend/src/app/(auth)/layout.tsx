import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Auth",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (user) {
    redirect("/");
  }

  return <main className={styles.main}>{children}</main>;
}
