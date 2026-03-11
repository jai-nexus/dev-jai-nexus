# Proposal (motion-0029)

## 0.0 Problem
motions 0025–0028 established:
- work packet contract + lifecycle
- governed routing actions
- execution lane derivation
- explicit execution role on packet creation
- vertical slice proof visibility

However, the assignee pool still originates from the broad registry/agency surface, which mixes:
- governance agents (council root, proposer, challenger, arbiter)
- execution-capable agents (architect, builder, verifier, librarian, operator)

This creates a semantic leak:
- execution role is now canonical
- but assignee selection is not yet explicitly constrained by execution eligibility

That means the system can still present governance-only agents in execution assignment surfaces, which weakens the architecture and risks misrouting work.

## 1.0 Goal
Introduce explicit execution-capability metadata into agency configuration and make it the source of truth for work packet assignment and execution-lane eligibility.

## 2.0 Solution
1) Extend agency configuration with explicit execution metadata
- mark whether an agent is execution-capable
- declare which execution roles an agent may carry
- preserve governance-only agents as governance-only

2) Separate governance and execution semantics
- governance agents remain valid for council / review / adjudication flows
- execution agents populate work packet assignment flows
- assignment surfaces stop treating the entire registry as the execution pool

3) Add execution-pool helper logic
- compute execution-eligible agents by requested role
- support role-scoped assignee lists for work packet creation and detail surfaces
- expose mismatch state where legacy assignments do not match requested role

4) Preserve backward compatibility
- do not require a schema migration
- allow legacy packets to continue rendering
- resolve eligibility from config first, then gracefully surface mismatches

## 3.0 Acceptance
- agency configuration explicitly supports execution-capable metadata
- work packet assignment can be constrained by requested role
- governance-only agents no longer appear as normal execution assignees
- legacy invalid assignments are surfaced as mismatches rather than silently treated as valid
- pnpm -C portal typecheck PASS

## 4.0 Non-goals
- no autonomous runner rollout in this motion
- no broad multi-repo agent scheduling
- no panel-system changes
- no database schema migration unless strictly necessary
