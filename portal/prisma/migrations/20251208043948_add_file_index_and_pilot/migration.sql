-- CreateTable
CREATE TABLE "FileIndex" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repoId" INTEGER NOT NULL,
    "syncRunId" INTEGER,
    "path" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "lastCommitSha" TEXT,
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileIndex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilotSession" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectKey" TEXT,
    "waveLabel" TEXT,
    "mode" TEXT NOT NULL,
    "surface" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "PilotSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PilotAction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" INTEGER NOT NULL,
    "mode" TEXT NOT NULL,
    "targetNodeId" TEXT,
    "actionType" TEXT NOT NULL,
    "payload" TEXT,
    "reason" TEXT NOT NULL,

    CONSTRAINT "PilotAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileIndex_repoId_idx" ON "FileIndex"("repoId");

-- CreateIndex
CREATE INDEX "FileIndex_extension_idx" ON "FileIndex"("extension");

-- CreateIndex
CREATE UNIQUE INDEX "FileIndex_repoId_path_key" ON "FileIndex"("repoId", "path");

-- CreateIndex
CREATE INDEX "PilotSession_surface_idx" ON "PilotSession"("surface");

-- CreateIndex
CREATE INDEX "PilotAction_sessionId_idx" ON "PilotAction"("sessionId");

-- CreateIndex
CREATE INDEX "PilotAction_mode_idx" ON "PilotAction"("mode");

-- CreateIndex
CREATE INDEX "PilotAction_actionType_idx" ON "PilotAction"("actionType");

-- AddForeignKey
ALTER TABLE "FileIndex" ADD CONSTRAINT "FileIndex_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileIndex" ADD CONSTRAINT "FileIndex_syncRunId_fkey" FOREIGN KEY ("syncRunId") REFERENCES "SyncRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PilotAction" ADD CONSTRAINT "PilotAction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PilotSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
