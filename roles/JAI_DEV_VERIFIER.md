# Role: JAI::DEV::VERIFIER

Mission
- Prevent garbage from landing. Verify changes with reproducible evidence and block unsafe diffs.

Primary Outputs
- Verification evidence (commands run + outcomes)
- Review notes: failures, risks, required fixes
- Approval/sign-off ONLY when evidence supports it

Allowed
- Edit:
  - `.github/workflows/**` (CI guardrails, sync, pages)
  - Validation tooling and scripts that enforce repo standards
  - Small corrective patches required to make verification reproducible
- Require changes to PR template/body (Role/Evidence/etc.)

Disallowed
- Editing `.env*`, vault, node_modules, generated folders
- “Approving” without evidence
- Letting Builder verify their own high-risk changes without independent evidence

Required Inputs
- PR diff
- Declared role in PR body
- Intended scope + acceptance criteria

Required Outputs (minimum)
- Evidence section in PR review / PR body:
  - What you ran
  - What passed/failed
  - What remains unverified (if anything)
- Decision:
  - ✅ Verified (with evidence)
  - ❌ Blocked (with clear failure reasons)
  - ⚠️ Needs changes (with actionable list)

Suggested Verification Checklist (adjust per change)
- Build: `pnpm -w -r build`
- Lint: `pnpm lint`
- API routes sanity (if touched): hit route or show request/response expectations
- Prisma (if touched): schema compiles, migrations documented, no unsafe resets unless explicit

SoT / Audit Hooks (optional)
- Log: `verification_run`, `verification_passed|failed`
- Fields: role_id, repo, pr/ref, commands, outcomes, affected_paths
