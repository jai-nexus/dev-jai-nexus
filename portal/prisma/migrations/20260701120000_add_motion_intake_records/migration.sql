CREATE TABLE "MotionIntakeRecord" (
  "id" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "title" TEXT NOT NULL,
  "proposer" TEXT NOT NULL,
  "targetThread" TEXT NOT NULL,
  "repoTarget" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "requestedOutcome" TEXT NOT NULL,
  "risks" TEXT NOT NULL,
  "constraints" TEXT NOT NULL,
  "evidencePointers" JSONB NOT NULL,
  "nonAuthorizations" JSONB NOT NULL,
  "intakeState" TEXT NOT NULL,
  "authorityState" TEXT NOT NULL,
  "advisoryOnly" BOOLEAN NOT NULL DEFAULT true,
  "safeAdvisoryMessage" TEXT NOT NULL,

  CONSTRAINT "MotionIntakeRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MotionIntakeRecord_createdAt_idx" ON "MotionIntakeRecord"("createdAt");
CREATE INDEX "MotionIntakeRecord_targetThread_idx" ON "MotionIntakeRecord"("targetThread");
CREATE INDEX "MotionIntakeRecord_repoTarget_idx" ON "MotionIntakeRecord"("repoTarget");
CREATE INDEX "MotionIntakeRecord_intakeState_idx" ON "MotionIntakeRecord"("intakeState");
CREATE INDEX "MotionIntakeRecord_authorityState_idx" ON "MotionIntakeRecord"("authorityState");
