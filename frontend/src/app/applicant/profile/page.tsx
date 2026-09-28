import { Box } from "@mui/material";
import { ProfileForm } from "./_components/profile-form";

export const metadata = {
  title: "Your profile",
};

export default function ProfilePage() {
  return (
    <Box sx={{ mx: "auto", px: 3, py: 4, maxWidth: 900 }}>
      <ProfileForm />
    </Box>
  );
}
