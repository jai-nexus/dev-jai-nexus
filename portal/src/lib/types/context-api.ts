// portal/src/lib/types/context-api.ts

// Shared types for the JAI Context API v0.1

export type RepoSummary = {
  id: number;               // numeric PK from DB
  nhId: string;             // e.g. "2.1.2"
  name: string;             // e.g. "jai-nexus/dev-jai-nexus"
  domainPod: string | null; // e.g. "jai.nexus"
  engineGroup: string | null; // frontend | backend | helper | meta
  status: string | null;      // "ACTIVE", etc.
  githubUrl: string | null;   // full HTTPS URL
  defaultBranch: string | null; // usually "main"
};
