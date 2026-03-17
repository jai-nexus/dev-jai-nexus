{
  "version": "0.2",
  "motion_id": "motion-0045",
  "votes": [
    {
      "voter_id": "manual:proposer",
      "role": "proposer",
      "vote": "yes",
      "rationale": "Motion-0045 successfully added a deterministic full-fidelity motion snapshot generator for dev-jai-nexus. The new exporter preserves full motion content, includes nested motion artifacts, and emits a manifest sidecar so future context bootstrapping no longer depends on degraded snapshots."
    },
    {
      "voter_id": "manual:challenger",
      "role": "challenger",
      "vote": "yes",
      "rationale": "The motion stayed tightly scoped. It fixed a real context-portability gap without drifting into retrieval, semantic indexing, or broader context-bundle redesign. The resulting exporter is deterministic, branch-aware, and practically useful."
    },
    {
      "voter_id": "manual:arbiter",
      "role": "arbiter",
      "vote": "yes",
      "rationale": "The implementation is coherent and strategically useful. dev-jai-nexus now has a governed export path for full motion history, including later motions and nested artifacts, which strengthens durable context portability across chats and future automation workflows."
    }
  ],
  "protocol_version": "0.3.8",
  "vote_mode": "unanimous_consent",
  "required_roles": [
    "proposer",
    "challenger",
    "arbiter"
  ],
  "outcome": {
    "yes": 3,
    "no": 0,
    "abstain": 0,
    "yes_with_reservations": 0,
    "result": "PASS",
    "reasons": [],
    "missing_required_roles": []
  },
  "last_updated": "2026-03-17T00:00:00.000Z"
}
