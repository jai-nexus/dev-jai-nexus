CREATE TYPE "program_lifecycle_state" AS ENUM (
  'NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN',
  'OPEN_FOR_BATCH_PLANNING_ONLY',
  'UNRESOLVED_HOLD',
  'CLOSED_ACCEPTED',
  'CLOSED_NO_GO',
  'CANCELLED',
  'FAILED'
);

CREATE TABLE "program_lifecycle_records" (
  "program_id" TEXT NOT NULL,
  "program_code" TEXT NOT NULL,
  "program_title" TEXT,
  "lifecycle_state" "program_lifecycle_state" NOT NULL
    DEFAULT 'NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "program_lifecycle_records_pkey" PRIMARY KEY ("program_id"),
  CONSTRAINT "program_lifecycle_records_program_code_key" UNIQUE ("program_code"),
  CONSTRAINT "program_lifecycle_records_program_id_format_check"
    CHECK ("program_id" ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  CONSTRAINT "program_lifecycle_records_program_code_format_check"
    CHECK ("program_code" ~ '^[A-Z][A-Z0-9]*-P[1-9][0-9]*$'),
  CONSTRAINT "program_lifecycle_records_program_title_format_check"
    CHECK (
      "program_title" IS NULL OR (
        btrim("program_title", E' \t\n\r\f\v') <> '' AND
        "program_title" = btrim("program_title", E' \t\n\r\f\v')
      )
    )
);

CREATE INDEX "program_lifecycle_records_lifecycle_state_idx"
  ON "program_lifecycle_records" ("lifecycle_state");

CREATE UNIQUE INDEX "program_lifecycle_records_single_open_program_idx"
  ON "program_lifecycle_records" ("lifecycle_state")
  WHERE "lifecycle_state" = 'OPEN_FOR_BATCH_PLANNING_ONLY';
