-- AlterTable
ALTER TABLE "SotEvent" ADD COLUMN     "workPacketId" INTEGER;

-- CreateIndex
CREATE INDEX "SotEvent_workPacketId_ts_idx" ON "SotEvent"("workPacketId", "ts");

-- AddForeignKey
ALTER TABLE "SotEvent" ADD CONSTRAINT "SotEvent_workPacketId_fkey" FOREIGN KEY ("workPacketId") REFERENCES "WorkPacket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
