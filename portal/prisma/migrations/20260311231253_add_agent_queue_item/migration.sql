-- CreateEnum
CREATE TYPE "AgentQueueStatus" AS ENUM ('PENDING', 'CLAIMED', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "AgentQueueItem" (
    "id" TEXT NOT NULL,
    "workPacketId" INTEGER NOT NULL,
    "agentNhId" TEXT NOT NULL,
    "repoScope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "AgentQueueStatus" NOT NULL DEFAULT 'PENDING',
    "claimedAt" TIMESTAMP(3),
    "leaseExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentQueueItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentQueueItem_workPacketId_key" ON "AgentQueueItem"("workPacketId");

-- AddForeignKey
ALTER TABLE "AgentQueueItem" ADD CONSTRAINT "AgentQueueItem_workPacketId_fkey" FOREIGN KEY ("workPacketId") REFERENCES "WorkPacket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
