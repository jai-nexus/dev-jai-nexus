-- CreateTable
CREATE TABLE "DeliberationRunHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "motionId" TEXT NOT NULL,
    "motionTitle" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "sourceMode" TEXT NOT NULL,
    "connectorStatus" JSONB NOT NULL,
    "participantOutputs" JSONB NOT NULL,
    "aggregateAdvisoryRatification" JSONB NOT NULL,
    "evidencePointers" JSONB NOT NULL,
    "nonAuthorizations" JSONB NOT NULL,
    "persistenceStatus" TEXT NOT NULL,
    "safeAdvisoryMessage" TEXT NOT NULL,

    CONSTRAINT "DeliberationRunHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DeliberationRunHistory_motionId_idx" ON "DeliberationRunHistory"("motionId");

-- CreateIndex
CREATE INDEX "DeliberationRunHistory_createdAt_idx" ON "DeliberationRunHistory"("createdAt");

-- CreateIndex
CREATE INDEX "DeliberationRunHistory_sourceMode_idx" ON "DeliberationRunHistory"("sourceMode");

-- CreateIndex
CREATE INDEX "DeliberationRunHistory_persistenceStatus_idx" ON "DeliberationRunHistory"("persistenceStatus");
