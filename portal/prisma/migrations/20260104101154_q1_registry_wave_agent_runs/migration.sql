-- CreateEnum
CREATE TYPE "WaveRunState" AS ENUM ('READY', 'PLANNING', 'EXECUTING', 'VERIFYING', 'RELEASING', 'ARCHIVING', 'COMPLETE', 'FAILED', 'CANCELED');

-- CreateEnum
CREATE TYPE "GateRunStatus" AS ENUM ('PENDING', 'RUNNING', 'PASS', 'FAIL', 'SKIP');

-- CreateEnum
CREATE TYPE "AgentRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELED');

-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "isDeprecated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "wave" INTEGER;

-- AlterTable
ALTER TABLE "WorkPacket" ADD COLUMN     "waveRunId" INTEGER;

-- CreateTable
CREATE TABLE "RegistrySnapshot" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quarter" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "lockedAt" TIMESTAMP(3),
    "contentHash" TEXT NOT NULL,
    "sourcePath" TEXT NOT NULL,
    "notes" JSONB,

    CONSTRAINT "RegistrySnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryRepo" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshotId" INTEGER NOT NULL,
    "nhId" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "description" TEXT,
    "tier" INTEGER,
    "role" TEXT,
    "status" "RepoStatus",
    "wave" INTEGER,
    "isDeprecated" BOOLEAN NOT NULL DEFAULT false,
    "notes" JSONB,

    CONSTRAINT "RegistryRepo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaveRun" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quarter" TEXT NOT NULL,
    "wave" INTEGER NOT NULL,
    "state" "WaveRunState" NOT NULL DEFAULT 'READY',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "summary" TEXT,
    "notes" JSONB,
    "snapshotId" INTEGER NOT NULL,
    "createdByUserId" TEXT,

    CONSTRAINT "WaveRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GateRun" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waveRunId" INTEGER NOT NULL,
    "gateId" TEXT NOT NULL,
    "status" "GateRunStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "summary" TEXT,
    "results" JSONB,

    CONSTRAINT "GateRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "status" "AgentRunStatus" NOT NULL DEFAULT 'QUEUED',
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "summary" TEXT,
    "inputs" JSONB,
    "outputs" JSONB,
    "errors" JSONB,
    "userId" TEXT,
    "waveRunId" INTEGER,
    "workPacketId" INTEGER,

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "label" TEXT,
    "uri" TEXT,
    "sha256" TEXT,
    "content" JSONB,
    "meta" JSONB,
    "waveRunId" INTEGER,
    "agentRunId" INTEGER,
    "workPacketId" INTEGER,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegistrySnapshot_quarter_idx" ON "RegistrySnapshot"("quarter");

-- CreateIndex
CREATE INDEX "RegistrySnapshot_locked_idx" ON "RegistrySnapshot"("locked");

-- CreateIndex
CREATE UNIQUE INDEX "RegistrySnapshot_quarter_version_key" ON "RegistrySnapshot"("quarter", "version");

-- CreateIndex
CREATE INDEX "RegistryRepo_nhId_idx" ON "RegistryRepo"("nhId");

-- CreateIndex
CREATE INDEX "RegistryRepo_wave_idx" ON "RegistryRepo"("wave");

-- CreateIndex
CREATE INDEX "RegistryRepo_status_idx" ON "RegistryRepo"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RegistryRepo_snapshotId_nhId_key" ON "RegistryRepo"("snapshotId", "nhId");

-- CreateIndex
CREATE INDEX "WaveRun_quarter_wave_idx" ON "WaveRun"("quarter", "wave");

-- CreateIndex
CREATE INDEX "WaveRun_state_idx" ON "WaveRun"("state");

-- CreateIndex
CREATE INDEX "WaveRun_snapshotId_idx" ON "WaveRun"("snapshotId");

-- CreateIndex
CREATE INDEX "GateRun_gateId_idx" ON "GateRun"("gateId");

-- CreateIndex
CREATE INDEX "GateRun_status_idx" ON "GateRun"("status");

-- CreateIndex
CREATE UNIQUE INDEX "GateRun_waveRunId_gateId_key" ON "GateRun"("waveRunId", "gateId");

-- CreateIndex
CREATE INDEX "AgentRun_agentId_idx" ON "AgentRun"("agentId");

-- CreateIndex
CREATE INDEX "AgentRun_action_idx" ON "AgentRun"("action");

-- CreateIndex
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");

-- CreateIndex
CREATE INDEX "AgentRun_waveRunId_idx" ON "AgentRun"("waveRunId");

-- CreateIndex
CREATE INDEX "AgentRun_workPacketId_idx" ON "AgentRun"("workPacketId");

-- CreateIndex
CREATE INDEX "Artifact_type_idx" ON "Artifact"("type");

-- CreateIndex
CREATE INDEX "Artifact_sha256_idx" ON "Artifact"("sha256");

-- CreateIndex
CREATE INDEX "Artifact_waveRunId_idx" ON "Artifact"("waveRunId");

-- CreateIndex
CREATE INDEX "Artifact_agentRunId_idx" ON "Artifact"("agentRunId");

-- CreateIndex
CREATE INDEX "Artifact_workPacketId_idx" ON "Artifact"("workPacketId");

-- CreateIndex
CREATE INDEX "Repo_wave_idx" ON "Repo"("wave");

-- CreateIndex
CREATE INDEX "Repo_isDeprecated_idx" ON "Repo"("isDeprecated");

-- CreateIndex
CREATE INDEX "WorkPacket_waveRunId_idx" ON "WorkPacket"("waveRunId");

-- AddForeignKey
ALTER TABLE "WorkPacket" ADD CONSTRAINT "WorkPacket_waveRunId_fkey" FOREIGN KEY ("waveRunId") REFERENCES "WaveRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryRepo" ADD CONSTRAINT "RegistryRepo_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "RegistrySnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaveRun" ADD CONSTRAINT "WaveRun_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "RegistrySnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaveRun" ADD CONSTRAINT "WaveRun_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GateRun" ADD CONSTRAINT "GateRun_waveRunId_fkey" FOREIGN KEY ("waveRunId") REFERENCES "WaveRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_waveRunId_fkey" FOREIGN KEY ("waveRunId") REFERENCES "WaveRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentRun" ADD CONSTRAINT "AgentRun_workPacketId_fkey" FOREIGN KEY ("workPacketId") REFERENCES "WorkPacket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_waveRunId_fkey" FOREIGN KEY ("waveRunId") REFERENCES "WaveRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_agentRunId_fkey" FOREIGN KEY ("agentRunId") REFERENCES "AgentRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_workPacketId_fkey" FOREIGN KEY ("workPacketId") REFERENCES "WorkPacket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
