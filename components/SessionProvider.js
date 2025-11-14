
// components/SessionProvider.js
"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }) {
  return (
    <NextAuthSessionProvider 
      refetchInterval={5 * 60} // Refresh every 5 minutes
      refetchOnWindowFocus={true} // Refresh when window gains focus
    >
      {children}
    </NextAuthSessionProvider>
  );
}