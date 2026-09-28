"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { SignOutButton } from "@/components/sign-out-button";

const LINKS = [
  { href: "/admin", label: "Jobs" },
  { href: "/admin/applications", label: "Applications" },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <Stack
      component="nav"
      direction="row"
      spacing={1}
      sx={{
        alignItems: "center",
        px: 3,
        py: 1.5,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {LINKS.map((link) => (
        <Button
          key={link.href}
          component={Link}
          href={link.href}
          variant={pathname === link.href ? "contained" : "text"}
          size="small"
        >
          {link.label}
        </Button>
      ))}
      <Stack sx={{ flexGrow: 1 }} />
      <SignOutButton />
    </Stack>
  );
}
