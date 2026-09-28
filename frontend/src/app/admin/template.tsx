import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/auth/session-user.type";
import { AdminNav } from "./_components/admin-nav";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (user?.role !== UserRole.ADMIN) {
    redirect(
      `/unauthorized?message=${encodeURIComponent("You must be an admin to view this page.")}`,
    );
  }

  return (
    <>
      <AdminNav />
      <main>{children}</main>
    </>
  );
}
