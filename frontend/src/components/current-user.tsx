"use client";
import { firebaseAuth } from "@/lib/firebase/client";
import { Typography } from "@mui/material";
import type { User } from "firebase/auth";
import { useEffect, useState } from "react";

export const CurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <Typography variant="h1">{user ? user.displayName : "No user"}</Typography>
  );
};
