import type { ReactNode } from "react";

import Divider from "@mui/material/Divider";

interface OrDividerProps {
  children?: ReactNode;
}

export function OrDivider({ children = "or" }: OrDividerProps) {
  return <Divider textAlign="center">{children}</Divider>;
}
