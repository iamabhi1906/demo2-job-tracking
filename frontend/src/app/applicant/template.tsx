import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/auth/session-user.type";
import { ApplicantNav } from "./_components/applicant-nav";

export const metadata: Metadata = {
  title: "Applicant Dashboard",
};

export default async function ApplicantTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (user?.role !== UserRole.APPLICANT) {
    redirect("/unauthorized");
  }

  return (
    <>
      <ApplicantNav />
      <main>{children}</main>
    </>
  );
}
