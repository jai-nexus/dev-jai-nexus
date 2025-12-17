// portal/src/app/operator/layout.tsx
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/auth";
import { OperatorSubnav } from "@/components/operator/OperatorSubnav";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OperatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <OperatorSubnav />
      {children}
    </>
  );
}
