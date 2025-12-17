// portal/src/app/login/LoginForm.tsx
"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: nextPath,
    });

    setPending(false);

    if (!res || res.error) {
      setError("Invalid email or password.");
      return;
    }

    window.location.href = res.url ?? nextPath;
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-800 bg-zinc-950 p-6 space-y-4"
      >
        <header>
          <h1 className="text-xl font-semibold">JAI NEXUS · Login</h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign in as <span className="font-mono">admin@jai.nexus</span> or{" "}
            <span className="font-mono">agent@jai.nexus</span>.
          </p>
        </header>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue="admin@jai.nexus"
            required
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-md border border-gray-700 bg-black px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
