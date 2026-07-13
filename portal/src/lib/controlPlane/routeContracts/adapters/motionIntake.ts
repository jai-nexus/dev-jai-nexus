export type MotionIntakePersistenceResult<RecordValue> =
  | {
      kind: "persisted";
      record: RecordValue;
    }
  | {
      kind: "blocked_preview";
      record: RecordValue;
      safeMessage: string;
    }
  | {
      kind: "unavailable_preview";
      record: RecordValue;
      safeMessage: string;
    };
