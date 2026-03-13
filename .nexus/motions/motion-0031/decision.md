# Decision Record — motion-0031

## Decision
Proceed with the builder live execution slice as the next controlled proof step.

## Reason
Motion-0030 established the first live architect execution path. The next missing stage in the governed vertical slice is builder execution. Proving builder claim, patch evidence, and verifier handoff is the smallest high-value increment.

## Constraints
- keep operator-governed assignment,
- keep role-first routing,
- no auto-handoff yet,
- no verifier runtime in this motion.

## Ratification condition
Ratify only after the builder runner is proven live and packet evidence shows verifier-ready handoff.
