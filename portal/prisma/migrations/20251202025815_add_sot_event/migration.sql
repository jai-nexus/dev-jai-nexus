-- CreateTable
CREATE TABLE "SotEvent" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ts" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "nhId" TEXT NOT NULL DEFAULT '',
    "summary" TEXT,
    "payload" JSONB,
    "repoId" INTEGER,
    "domainId" INTEGER,

    CONSTRAINT "SotEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SotEvent_ts_repoId_domainId_idx" ON "SotEvent"("ts", "repoId", "domainId");

-- AddForeignKey
ALTER TABLE "SotEvent" ADD CONSTRAINT "SotEvent_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SotEvent" ADD CONSTRAINT "SotEvent_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
