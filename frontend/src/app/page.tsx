import { SignOutButton } from "@/components/sign-out-button";
import { getSessionUser } from "@/lib/auth/session";
import { UserRole } from "@/lib/auth/session-user.type";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

export default async function Home() {
  const user = await getSessionUser();

  return (
    <Box>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: "#fff" }}>
            Job Tracking
          </Typography>
          <SignOutButton />
        </Toolbar>
      </AppBar>

      <Typography variant="h1" color="primary">
        Welcome {user?.name} to Job Trackering
      </Typography>

      {user?.role === UserRole.ADMIN ? (
        <Button variant="contained">
          <Link href="/admin">Admin</Link>
        </Button>
      ) : (
        <Button variant="contained">
          <Link href="/applicant">View jobs</Link>
        </Button>
      )}
    </Box>
  );
}
