// portal/src/lib/dbEnums.ts
// Central export for Prisma enums to avoid import-path drift.
// IMPORTANT: Turbopack can be touchy with re-export patterns.
// Keep this file enums-only.

import {
  RepoStatus,
  DomainStatus,
  DomainEnv,
  Role,
  WorkPacketStatus,
  InboxItemStatus,
} from "../../prisma/generated/prisma";

export {
  RepoStatus,
  DomainStatus,
  DomainEnv,
  Role,
  WorkPacketStatus,
  InboxItemStatus,
};

// Type aliases (different names) derived from runtime enums
export type RepoStatusValue = (typeof RepoStatus)[keyof typeof RepoStatus];
export type DomainStatusValue = (typeof DomainStatus)[keyof typeof DomainStatus];
export type DomainEnvValue = (typeof DomainEnv)[keyof typeof DomainEnv];
export type RoleValue = (typeof Role)[keyof typeof Role];
export type WorkPacketStatusValue =
  (typeof WorkPacketStatus)[keyof typeof WorkPacketStatus];
export type InboxItemStatusValue =
  (typeof InboxItemStatus)[keyof typeof InboxItemStatus];
 