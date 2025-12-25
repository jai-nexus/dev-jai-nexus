/*
  Warnings:

  - A unique constraint covering the columns `[workPacketId]` on the table `AgentInboxItem` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AgentInboxItem_workPacketId_agentUserId_key";

-- CreateIndex
CREATE UNIQUE INDEX "AgentInboxItem_workPacketId_key" ON "AgentInboxItem"("workPacketId");
