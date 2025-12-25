-- DropForeignKey
ALTER TABLE "FileIndex" DROP CONSTRAINT "FileIndex_repoId_fkey";

-- DropForeignKey
ALTER TABLE "PilotAction" DROP CONSTRAINT "PilotAction_sessionId_fkey";

-- AlterTable
ALTER TABLE "Domain" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Repo" ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "FileIndex" ADD CONSTRAINT "FileIndex_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotAction" ADD CONSTRAINT "PilotAction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PilotSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
