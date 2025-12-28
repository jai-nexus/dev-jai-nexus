// portal/src/lib/dbEnums.ts
// Single source of truth for Prisma enums.
// Import from here everywhere to avoid path drift.

export {
  RepoStatus,
  DomainStatus,
  DomainEnv,
  WorkPacketStatus,
  InboxItemStatus,
} from "../../prisma/generated/prisma";
