ALTER TABLE "program_lifecycle_records"
  ADD COLUMN "lifecycle_version" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "program_lifecycle_records"
  ADD CONSTRAINT "program_lifecycle_records_lifecycle_version_nonnegative_check"
  CHECK ("lifecycle_version" >= 0);
