CREATE TABLE "control_thread_passalong_records" (
  "id" TEXT NOT NULL,
  "passalong_id" TEXT NOT NULL,
  "source_thread_id" TEXT NOT NULL,
  "target_thread_id" TEXT NOT NULL,
  "source_thread_label" TEXT NOT NULL,
  "target_thread_label" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "evidence_pointers" JSONB NOT NULL,
  "requested_decision" TEXT NOT NULL,
  "route_status" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "authority_boundary" TEXT NOT NULL,
  "non_authorizations" JSONB NOT NULL,
  "sandbox_posture" TEXT,
  "import_adoption_posture" TEXT,
  "manual_operator_note" TEXT,
  "archive_state" TEXT NOT NULL DEFAULT 'active',
  "archived_at" TIMESTAMP(3),
  "deleted_at" TIMESTAMP(3),
  "redaction_state" TEXT NOT NULL DEFAULT 'not_required',
  "schema_version" TEXT NOT NULL DEFAULT 'v0',

  CONSTRAINT "control_thread_passalong_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "control_thread_passalong_records_passalong_id_key"
  ON "control_thread_passalong_records"("passalong_id");

CREATE INDEX "control_thread_passalong_records_target_status_created_idx"
  ON "control_thread_passalong_records"("target_thread_id", "route_status", "created_at");

CREATE INDEX "control_thread_passalong_records_source_status_created_idx"
  ON "control_thread_passalong_records"("source_thread_id", "route_status", "created_at");

CREATE INDEX "control_thread_passalong_records_status_created_idx"
  ON "control_thread_passalong_records"("route_status", "created_at");

CREATE INDEX "control_thread_passalong_records_archive_created_idx"
  ON "control_thread_passalong_records"("archive_state", "created_at");

CREATE INDEX "control_thread_passalong_records_sandbox_created_idx"
  ON "control_thread_passalong_records"("sandbox_posture", "created_at");

CREATE INDEX "control_thread_passalong_records_import_created_idx"
  ON "control_thread_passalong_records"("import_adoption_posture", "created_at");
