/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `WorkPacket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "WorkPacket" ADD COLUMN     "externalId" TEXT;

-- CreateTable
CREATE TABLE "SourceSignal" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "date" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "published_at" TEXT,
    "tier" TEXT,
    "artifact_path" TEXT NOT NULL,
    "artifact_sha256" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SourceSignal_artifact_sha256_key" ON "SourceSignal"("artifact_sha256");

-- CreateIndex
CREATE INDEX "SourceSignal_vendor_date_idx" ON "SourceSignal"("vendor", "date");

-- CreateIndex
CREATE INDEX "SourceSignal_ts_idx" ON "SourceSignal"("ts");

-- CreateIndex
CREATE UNIQUE INDEX "WorkPacket_externalId_key" ON "WorkPacket"("externalId");
