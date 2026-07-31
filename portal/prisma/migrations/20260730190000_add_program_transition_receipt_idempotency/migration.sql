CREATE TYPE "program_transition_receipt_issuance_state" AS ENUM ('ISSUED');
CREATE TYPE "program_transition_receipt_integrity_state" AS ENUM ('UNVERIFIED');
CREATE TYPE "program_transition_receipt_authenticity_state" AS ENUM ('NOT_ESTABLISHED');
CREATE TYPE "program_transition_receipt_issuer_authority_state" AS ENUM ('NOT_ESTABLISHED');

CREATE TABLE "program_transition_commands" (
  "command_id" TEXT NOT NULL,
  "idempotency_key_hash" TEXT NOT NULL,
  "request_fingerprint" TEXT NOT NULL,
  "fingerprint_version" TEXT NOT NULL,
  "candidate_program_id" TEXT NOT NULL,
  "operation_kind" TEXT NOT NULL,
  "superseded_program_id" TEXT,
  "expected_receipt_count" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "program_transition_commands_pkey" PRIMARY KEY ("command_id"),
  CONSTRAINT "program_transition_commands_key_hash_key" UNIQUE ("idempotency_key_hash"),
  CONSTRAINT "program_transition_commands_id_check" CHECK ("command_id" ~ '^ptc-v1-[0-9a-f]{64}$'),
  CONSTRAINT "program_transition_commands_key_hash_check" CHECK ("idempotency_key_hash" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "program_transition_commands_fingerprint_check" CHECK ("request_fingerprint" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "program_transition_commands_fingerprint_version_check" CHECK ("fingerprint_version" = 'c8-transition-command/v3'),
  CONSTRAINT "program_transition_commands_operation_check" CHECK (("operation_kind" = 'OPEN_CANDIDATE' AND "expected_receipt_count" = 1 AND "superseded_program_id" IS NULL) OR ("operation_kind" = 'HOLD_AND_OPEN' AND "expected_receipt_count" = 2 AND "superseded_program_id" IS NOT NULL AND "superseded_program_id" <> "candidate_program_id"))
);

CREATE TABLE "program_lifecycle_transition_receipts" (
  "receipt_id" TEXT NOT NULL,
  "command_id" TEXT NOT NULL,
  "receipt_ordinal" INTEGER NOT NULL,
  "receipt_class_id" TEXT NOT NULL,
  "receipt_class_name" TEXT NOT NULL,
  "transition_id" TEXT NOT NULL,
  "lifecycle_axis_id" TEXT NOT NULL,
  "subject_program_id" TEXT NOT NULL,
  "source_state" "program_lifecycle_state" NOT NULL,
  "result_state" "program_lifecycle_state" NOT NULL,
  "source_lifecycle_version" INTEGER NOT NULL,
  "result_lifecycle_version" INTEGER NOT NULL,
  "issuance_state" "program_transition_receipt_issuance_state" NOT NULL,
  "integrity_state" "program_transition_receipt_integrity_state" NOT NULL,
  "authenticity_state" "program_transition_receipt_authenticity_state" NOT NULL,
  "issuer_authority_state" "program_transition_receipt_issuer_authority_state" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "program_lifecycle_transition_receipts_pkey" PRIMARY KEY ("receipt_id"),
  CONSTRAINT "program_lifecycle_transition_receipts_command_ordinal_key" UNIQUE ("command_id", "receipt_ordinal"),
  CONSTRAINT "program_lifecycle_transition_receipts_command_subject_key" UNIQUE ("command_id", "subject_program_id"),
  CONSTRAINT "program_lifecycle_transition_receipts_command_fkey" FOREIGN KEY ("command_id") REFERENCES "program_transition_commands"("command_id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "program_lifecycle_transition_receipts_id_check" CHECK ("receipt_id" ~ '^ptr-v1-[0-9a-f]{64}$'),
  CONSTRAINT "program_lifecycle_transition_receipts_ordinal_check" CHECK ("receipt_ordinal" IN (1, 2)),
  CONSTRAINT "program_lifecycle_transition_receipts_class_pair_check" CHECK ("receipt_class_id" = 'B9-CLASS-011' AND "receipt_class_name" = 'LIFECYCLE_TRANSITION_RECEIPT'),
  CONSTRAINT "program_lifecycle_transition_receipts_axis_check" CHECK ("lifecycle_axis_id" = 'B1-AX-08'),
  CONSTRAINT "program_lifecycle_transition_receipts_version_check" CHECK ("source_lifecycle_version" >= 0 AND "source_lifecycle_version" <= 2147483647 AND "result_lifecycle_version" = "source_lifecycle_version" + 1 AND "result_lifecycle_version" <= 2147483647),
  CONSTRAINT "program_lifecycle_transition_receipts_shape_check" CHECK (("transition_id" = 'B1-TR-027' AND "source_state" = 'NOT_ROUTED / NOT_OPEN / DOWNSTREAM_FROZEN' AND "result_state" = 'OPEN_FOR_BATCH_PLANNING_ONLY') OR ("transition_id" = 'B1-TR-028' AND "source_state" = 'OPEN_FOR_BATCH_PLANNING_ONLY' AND "result_state" = 'UNRESOLVED_HOLD'))
);

CREATE INDEX "program_transition_commands_candidate_program_id_idx" ON "program_transition_commands" ("candidate_program_id");
CREATE INDEX "program_lifecycle_transition_receipts_subject_program_id_idx" ON "program_lifecycle_transition_receipts" ("subject_program_id");
