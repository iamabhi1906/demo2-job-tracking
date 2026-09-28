import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/auth/session-user.type";

export const metadata: Metadata = {
  title: "Applicant Dashboard",
};

export default async function ApplicantTemplate({
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

  return <main>{children}</main>;
}
