import { CurrentUser } from "@/components/current-user";
import { SignOutButton } from "@/components/sign-out-button";
import { firebaseAuth } from "@/lib/firebase/client";
import { Box, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box>
      <Typography variant="h1" color="primary">
        This is just a tesing Page
        {firebaseAuth.app.name}
      </Typography>

      <CurrentUser />
      <SignOutButton />
    </Box>
  );
}
