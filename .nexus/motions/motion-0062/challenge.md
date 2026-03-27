# Challenge (motion-0062)

## Risks
- Help text changes are low-risk but could introduce inconsistencies if
  not carefully verified against the real CLI.
- Copy-paste examples with placeholder motion IDs could confuse operators
  if they copy them literally without substituting their own motion ID.
- Playbook changes, even conditional ones, could introduce drift from the
  help text if not verified together.

## Objections
- Verification is straightforward: run the help text and confirm it
  matches. The motion's execution plan includes this step.
- Examples use motion-NNNN as a placeholder, which is the existing
  convention and clearly illustrative.
- Playbook changes are explicitly conditional on real drift. If the
  playbook already matches, it stays untouched.

## Mitigations
- All changes are to operator-facing strings only.
- No behavioral changes of any kind.
- Verification includes running the updated help text.
- Playbook update is conditional and verified against the help text.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
