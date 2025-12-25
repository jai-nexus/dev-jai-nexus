-- CreateEnum
CREATE TYPE "InboxItemStatus" AS ENUM ('QUEUED', 'CLAIMED', 'IN_PROGRESS', 'PROPOSED', 'DONE', 'BLOCKED', 'CANCELED');

-- CreateTable
CREATE TABLE "AgentInboxItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "InboxItemStatus" NOT NULL DEFAULT 'QUEUED',
    "priority" INTEGER NOT NULL DEFAULT 50,
    "lockedAt" TIMESTAMP(3),
    "lockedByRun" TEXT,
    "claimedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "agentUserId" TEXT,
    "workPacketId" INTEGER NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" JSONB,

    CONSTRAINT "AgentInboxItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AgentInboxItem_status_priority_idx" ON "AgentInboxItem"("status", "priority");

-- CreateIndex
CREATE INDEX "AgentInboxItem_agentUserId_status_idx" ON "AgentInboxItem"("agentUserId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AgentInboxItem_workPacketId_agentUserId_key" ON "AgentInboxItem"("workPacketId", "agentUserId");

-- AddForeignKey
ALTER TABLE "AgentInboxItem" ADD CONSTRAINT "AgentInboxItem_agentUserId_fkey" FOREIGN KEY ("agentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentInboxItem" ADD CONSTRAINT "AgentInboxItem_workPacketId_fkey" FOREIGN KEY ("workPacketId") REFERENCES "WorkPacket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
