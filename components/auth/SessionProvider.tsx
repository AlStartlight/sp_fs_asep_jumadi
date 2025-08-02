"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface AuthSessionProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export function AuthSessionProvider({ children, session }: AuthSessionProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
