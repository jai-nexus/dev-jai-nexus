"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-gray-300 hover:text-white"
      type="button"
    >
      Logout
    </button>
  );
}
