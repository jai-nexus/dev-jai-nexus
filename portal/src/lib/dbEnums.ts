// portal/src/lib/dbEnums.ts
// Central export surface for Prisma enum *values* + *types* (no re-export-from).
// This avoids Turbopack/TS “exported multiple times” + import-path drift.

import {
  RepoStatus as RepoStatusValue,
  DomainStatus as DomainStatusValue,
  DomainEnv as DomainEnvValue,
  Role as RoleValue,
  WorkPacketStatus as WorkPacketStatusValue,
  InboxItemStatus as InboxItemStatusValue,
} from "../../prisma/generated/prisma";

// Runtime enum-like objects (what you use at runtime: RepoStatus.ACTIVE, etc.)
export const RepoStatus = RepoStatusValue;
export const DomainStatus = DomainStatusValue;
export const DomainEnv = DomainEnvValue;
export const Role = RoleValue;
export const WorkPacketStatus = WorkPacketStatusValue;
export const InboxItemStatus = InboxItemStatusValue;

// Type unions derived from the runtime objects (what you use in type positions)
export type RepoStatus = (typeof RepoStatus)[keyof typeof RepoStatus];
export type DomainStatus = (typeof DomainStatus)[keyof typeof DomainStatus];
export type DomainEnv = (typeof DomainEnv)[keyof typeof DomainEnv];
export type Role = (typeof Role)[keyof typeof Role];
export type WorkPacketStatus =
  (typeof WorkPacketStatus)[keyof typeof WorkPacketStatus];
export type InboxItemStatus =
  (typeof InboxItemStatus)[keyof typeof InboxItemStatus];
