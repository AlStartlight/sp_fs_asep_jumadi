"use client";

import { SessionProvider } from "next-auth/react";

export function AuthSessionProvider({ children, session }: any) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
