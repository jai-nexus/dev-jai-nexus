import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { createProgramActivationAuthorityHandler } from "@/lib/controlPlane/programLifecycle/program-activation-authority-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handleProgramActivationAuthorityRequest =
  createProgramActivationAuthorityHandler({
    readSecret: () => process.env.NEXTAUTH_SECRET,
    authenticate: async (request, secret) => {
      const token = await getToken({
        req: request as NextRequest,
        secret,
      });
      if (!token) {
        return { authenticated: false };
      }
      return {
        authenticated: true,
        role: token.role,
        email: token.email,
      };
    },
  });

export async function POST(request: NextRequest): Promise<Response> {
  return handleProgramActivationAuthorityRequest(request);
}
