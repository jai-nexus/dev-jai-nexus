-- CreateEnum
CREATE TYPE "WorkPacketStatus" AS ENUM ('DRAFT', 'PLANNED', 'IN_PROGRESS', 'IN_REVIEW', 'BLOCKED', 'DONE');

-- CreateTable
CREATE TABLE "WorkPacket" (
    "id" SERIAL NOT NULL,
    "nhId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "WorkPacketStatus" NOT NULL DEFAULT 'DRAFT',
    "ac" TEXT NOT NULL DEFAULT '',
    "plan" TEXT NOT NULL DEFAULT '',
    "githubIssueUrl" TEXT,
    "githubPrUrl" TEXT,
    "verificationUrl" TEXT,
    "repoId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPacket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkPacket_nhId_idx" ON "WorkPacket"("nhId");

-- CreateIndex
CREATE INDEX "WorkPacket_status_idx" ON "WorkPacket"("status");

-- AddForeignKey
ALTER TABLE "WorkPacket" ADD CONSTRAINT "WorkPacket_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
