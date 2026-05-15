# Challenge: Agent Voting and Ratification Design v0

## Risks

- future vote-design guidance could be mistaken for live voting enablement
- additional governance-lane identities could be routed implicitly without a
  later motion
- human intervention could be hidden instead of made explicit

## Mitigations

- state that live voting and autonomous ratification are inactive
- keep the recent canonical three-voter posture explicit
- note that `jai-executor` requires later routing if ever added
- require explicit human intervention fields where needed
