# Candidate Seam Template

Use this template when an orchestrator session needs to compare multiple bounded
seams and recommend one next seam.

Required:

- current repo framing
- candidate seams
- recommendation
- why this seam is next
- seams explicitly deferred

Optional:

- receiving coordination mode note when the recommendation must name where it goes next

This is a recommendation structure only. It does not launch execution or mutate
governance state.

---

## Current repo framing

Required:

- repo: `{repo}`
- active program or workstream: `{program}`
- settled canon relevant to this review: `{ratified motions / active docs}`
- current boundary: `{what is already in scope and what is not}`

Optional:

- branch or baseline note if it materially affects the comparison

---

## Candidate seams

List one entry per viable seam.

### Seam A - {seam name}

- description: `{one-sentence seam description}`
- why viable now: `{why this seam can be recommended now}`
- what it unblocks: `{what becomes possible if this seam is done}`
- risk if deferred: `{what is lost or delayed if this seam is not selected now}`

### Seam B - {seam name}

- description: `{one-sentence seam description}`
- why viable now: `{why this seam can be recommended now}`
- what it unblocks: `{what becomes possible if this seam is done}`
- risk if deferred: `{what is lost or delayed if this seam is not selected now}`

Keep each seam bounded. Do not merge multiple unrelated seams into one candidate.

---

## Recommendation

Required:

- recommended next seam: `{seam name}`
- receiving coordination mode: `{REPO_EXECUTION | CONTROL_THREAD | EXPLORATION}`

Optional:

- ranked alternatives when the comparison needs explicit ordering

---

## Why this seam is next

Required:

- bounded rationale: `{why this seam should happen before the others}`
- timing rationale: `{why now rather than later}`
- fit rationale: `{why this receiving mode is the right next destination}`

Keep the rationale specific to the current repo framing rather than generic.

---

## Seams explicitly deferred

Required:

- deferred seam: `{name}` - reason: `{why it is not next}`
- deferred seam: `{name}` - reason: `{why it is not next}`

This section keeps the comparison falsifiable and prevents silent scope loss.
