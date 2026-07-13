export type PassalongListResult<RecordValue> =
  | {
      kind: "available";
      records: RecordValue[];
      safeMessage: string;
    }
  | {
      kind: "unavailable";
      records: [];
      safeMessage: string;
      errors: string[];
    };

export type PassalongWriteResult<RecordValue> =
  | {
      kind: "succeeded";
      record: RecordValue;
      errors: [];
      safeMessage: string;
    }
  | {
      kind: "failed";
      record: null;
      errors: string[];
      safeMessage: string;
    }
  | {
      kind: "unavailable";
      record: null;
      errors: string[];
      safeMessage: string;
    };
