import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { createLocalOperatingLoopHandler } from "@/lib/controlPlane/motionKernel/local-operating-loop-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handleLocalOperatingLoopRequest = createLocalOperatingLoopHandler({
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
  return handleLocalOperatingLoopRequest(request);
}
