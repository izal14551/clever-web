"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import { RouteProgressProvider } from "./RouteProgress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RouteProgressProvider>{children}</RouteProgressProvider>
    </SessionProvider>
  );
}
