"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { firebaseAuth } from "@/lib/firebase/client";
import { destroySession } from "@/lib/auth/session-client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    try {
      await destroySession();
      await signOut(firebaseAuth);
      router.replace("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={onClick}
      size="large"
      variant="contained"
      startIcon={
        loading && <CircularProgress color="inherit" size={18} thickness={5} />
      }
    >
      Sign out
    </Button>
  );
}
