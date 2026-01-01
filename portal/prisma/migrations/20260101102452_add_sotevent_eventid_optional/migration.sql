/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `SotEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SotEvent" ADD COLUMN     "eventId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SotEvent_eventId_key" ON "SotEvent"("eventId");
