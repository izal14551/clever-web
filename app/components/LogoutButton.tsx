"use client";

import { signOut } from "next-auth/react";
import { useRouteProgress } from "./RouteProgress";

export function LogoutButton() {
  const routeProgress = useRouteProgress();

  return (
    <button
      type="button"
      onClick={() => {
        routeProgress.start();
        signOut({ callbackUrl: "/login" });
      }}
      className="w-full h-12 rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
    >
      Logout
    </button>
  );
}
