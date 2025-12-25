/*
  Safe enum migration (NO data loss).

  Converts:
  - Repo.status  (text -> RepoStatus)
  - Domain.status (text -> DomainStatus)
  - Domain.env   (text -> DomainEnv)

  Also creates enums and ensures indexes exist.
*/

-- CreateEnum
CREATE TYPE "RepoStatus" AS ENUM ('active', 'frozen', 'planned', 'parked');

-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('live', 'planned', 'parked');

-- CreateEnum
CREATE TYPE "DomainEnv" AS ENUM ('prod', 'stage', 'dev');

-- --- Repo.status: text -> RepoStatus (normalize + cast, keep data) ---
ALTER TABLE "Repo"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Repo"
  ALTER COLUMN "status" TYPE "RepoStatus"
  USING (
    CASE
      WHEN "status" IS NULL OR btrim("status") = '' THEN 'planned'::"RepoStatus"
      WHEN lower(btrim("status")) IN ('active','frozen','planned','parked')
        THEN lower(btrim("status"))::"RepoStatus"
      ELSE 'planned'::"RepoStatus"
    END
  );

ALTER TABLE "Repo"
  ALTER COLUMN "status" SET DEFAULT 'planned',
  ALTER COLUMN "status" SET NOT NULL;

-- --- Domain.status: text -> DomainStatus (normalize + cast, keep data) ---
ALTER TABLE "Domain"
  ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Domain"
  ALTER COLUMN "status" TYPE "DomainStatus"
  USING (
    CASE
      WHEN "status" IS NULL OR btrim("status") = '' THEN 'planned'::"DomainStatus"
      WHEN lower(btrim("status")) IN ('live','planned','parked')
        THEN lower(btrim("status"))::"DomainStatus"
      ELSE 'planned'::"DomainStatus"
    END
  );

ALTER TABLE "Domain"
  ALTER COLUMN "status" SET DEFAULT 'planned',
  ALTER COLUMN "status" SET NOT NULL;

-- --- Domain.env: text -> DomainEnv (nullable; normalize + cast) ---
ALTER TABLE "Domain"
  ALTER COLUMN "env" TYPE "DomainEnv"
  USING (
    CASE
      WHEN "env" IS NULL OR btrim("env") = '' THEN NULL
      WHEN lower(btrim("env")) IN ('prod','stage','dev')
        THEN lower(btrim("env"))::"DomainEnv"
      WHEN lower(btrim("env")) IN ('production') THEN 'prod'::"DomainEnv"
      WHEN lower(btrim("env")) IN ('staging') THEN 'stage'::"DomainEnv"
      ELSE NULL
    END
  );

-- Indexes (use IF NOT EXISTS so this migration is robust)
CREATE INDEX IF NOT EXISTS "Domain_nhId_idx" ON "Domain"("nhId");
CREATE INDEX IF NOT EXISTS "Repo_nhId_idx" ON "Repo"("nhId");
CREATE INDEX IF NOT EXISTS "SotEvent_ts_idx" ON "SotEvent"("ts");
CREATE INDEX IF NOT EXISTS "SotEvent_kind_idx" ON "SotEvent"("kind");
CREATE INDEX IF NOT EXISTS "SotEvent_source_idx" ON "SotEvent"("source");
CREATE INDEX IF NOT EXISTS "SotEvent_nhId_idx" ON "SotEvent"("nhId");
