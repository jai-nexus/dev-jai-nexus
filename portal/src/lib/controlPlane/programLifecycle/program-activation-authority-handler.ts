import {
  evaluateProgramActivationEligibility,
  type ProgramActivationEligibilityResult,
} from "./program-activation-eligibility-gate";

type ProgramActivationAuthorityAuthentication =
  | { readonly authenticated: false }
  | {
      readonly authenticated: true;
      readonly role: unknown;
      readonly email: unknown;
    };

export type ProgramActivationAuthorityHandlerDependencies = {
  readonly readSecret: () => unknown;
  readonly authenticate: (
    request: Request,
    secret: string,
  ) => Promise<ProgramActivationAuthorityAuthentication>;
};

type ProgramActivationAuthorityErrorCode =
  | "SERVER_SECRET_UNAVAILABLE"
  | "UNAUTHENTICATED"
  | "ADMIN_REQUIRED"
  | "ACTOR_EMAIL_REQUIRED"
  | "INVALID_JSON"
  | "INVALID_REQUEST";

type ProgramActivationAuthoritySuccess = {
  readonly ok: true;
  readonly kind: "AUTHORIZED_ADMIN_REQUEST";
  readonly requestAuthorizationClassification: "SERVER_DERIVED_ADMIN";
  readonly actor: string;
  readonly role: "ADMIN";
  readonly eligibility: ProgramActivationEligibilityResult;
  readonly activationAuthorized: false;
  readonly activationPerformed: false;
};

type ProgramActivationAuthorityError = {
  readonly ok: false;
  readonly error: {
    readonly code: ProgramActivationAuthorityErrorCode;
    readonly message: string;
  };
  readonly activationAuthorized: false;
  readonly activationPerformed: false;
};

function errorResponse(
  status: number,
  code: ProgramActivationAuthorityErrorCode,
  message: string,
): Response {
  const body: ProgramActivationAuthorityError = {
    ok: false,
    error: { code, message },
    activationAuthorized: false,
    activationPerformed: false,
  };
  return jsonResponse(body, status);
}

function jsonResponse(
  body: ProgramActivationAuthoritySuccess | ProgramActivationAuthorityError,
  status: number,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function canonicalActorEmail(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (
    normalized.length === 0 ||
    normalized.length > 320 ||
    /[\s\p{Cc}]/u.test(normalized)
  ) {
    return null;
  }

  const atIndex = normalized.indexOf("@");
  if (
    atIndex <= 0 ||
    atIndex !== normalized.lastIndexOf("@") ||
    atIndex === normalized.length - 1
  ) {
    return null;
  }

  return normalized;
}

function validSecret(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function createProgramActivationAuthorityHandler(
  dependencies: ProgramActivationAuthorityHandlerDependencies,
) {
  return async function handleProgramActivationAuthorityRequest(
    request: Request,
  ): Promise<Response> {
    let secret: unknown;
    try {
      secret = dependencies.readSecret();
    } catch {
      return errorResponse(
        503,
        "SERVER_SECRET_UNAVAILABLE",
        "Server request authorization is unavailable.",
      );
    }
    if (!validSecret(secret)) {
      return errorResponse(
        503,
        "SERVER_SECRET_UNAVAILABLE",
        "Server request authorization is unavailable.",
      );
    }

    let authentication: ProgramActivationAuthorityAuthentication;
    try {
      authentication = await dependencies.authenticate(request, secret);
    } catch {
      authentication = { authenticated: false };
    }
    if (!authentication.authenticated) {
      return errorResponse(
        401,
        "UNAUTHENTICATED",
        "An authenticated request is required.",
      );
    }
    if (authentication.role !== "ADMIN") {
      return errorResponse(
        403,
        "ADMIN_REQUIRED",
        "An ADMIN request is required.",
      );
    }

    const actor = canonicalActorEmail(authentication.email);
    if (!actor) {
      return errorResponse(
        403,
        "ACTOR_EMAIL_REQUIRED",
        "A valid server actor is required.",
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse(
        400,
        "INVALID_JSON",
        "The request body must be valid JSON.",
      );
    }

    const eligibility = evaluateProgramActivationEligibility(body);
    if (eligibility.kind === "INVALID_INPUT") {
      return errorResponse(
        400,
        "INVALID_REQUEST",
        "The request body does not match the activation eligibility contract.",
      );
    }

    const success: ProgramActivationAuthoritySuccess = {
      ok: true,
      kind: "AUTHORIZED_ADMIN_REQUEST",
      requestAuthorizationClassification: "SERVER_DERIVED_ADMIN",
      actor,
      role: "ADMIN",
      eligibility,
      activationAuthorized: false,
      activationPerformed: false,
    };
    return jsonResponse(success, 200);
  };
}
