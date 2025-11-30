-- CreateTable
CREATE TABLE "Repo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nhId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domainPod" TEXT,
    "engineGroup" TEXT,
    "language" TEXT,
    "status" TEXT,
    "owner" TEXT,
    "defaultBranch" TEXT,
    "githubUrl" TEXT,
    "notes" JSONB
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nhId" TEXT NOT NULL DEFAULT '',
    "domain" TEXT NOT NULL,
    "status" TEXT,
    "domainKey" TEXT,
    "engineType" TEXT,
    "env" TEXT,
    "expiresAt" DATETIME,
    "notes" JSONB,
    "repoId" INTEGER,
    CONSTRAINT "Domain_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "trigger" TEXT,
    "startedAt" DATETIME NOT NULL,
    "finishedAt" DATETIME NOT NULL,
    "workflowRunUrl" TEXT,
    "summary" TEXT,
    "payload" JSONB,
    "repoId" INTEGER,
    CONSTRAINT "SyncRun_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "JaiTool" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "description" TEXT,
    "scope" TEXT,
    "status" TEXT,
    "inputSchema" JSONB,
    "outputSchema" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "Repo_name_key" ON "Repo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_domain_key" ON "Domain"("domain");
