# Challenge (motion-0060)

## Risks
- Documentation can become stale if the factory evolves and the playbook
  is not updated.
- A single playbook file could grow unwieldy if future factory features
  are added without restructuring the doc.
- Operators might treat the playbook as a complete specification rather
  than a practical guide, leading to confusion if edge cases are not
  covered.

## Objections
- Staleness is mitigated by keeping the playbook focused on v0 commands
  that are already proven and stable. Future feature motions should
  update the playbook as part of their scope.
- The playbook covers one system (Motion Factory v0) with four commands.
  It is unlikely to grow unwieldy in the near term.
- The playbook is explicitly framed as an operator guide, not a formal
  specification. Edge cases are handled by the factory's error messages
  and the human review step.

## Mitigations
- Playbook is a single markdown file in a clear location.
- Future motions that change factory behavior should include a playbook
  update in their scope.
- The playbook references specific proven motions for provenance.
- Concrete CLI examples make the playbook immediately usable.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.00
