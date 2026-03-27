# Challenge (motion-0009)

## Key risks
1) Deadlock risk: unanimity can stall progress if blockers are not structured.
2) Process overhead: extra rounds increase cycle time and may reduce throughput.
3) Agent quality variance: unanimity is only as good as the challenger’s ability to detect real issues.
4) Misuse of NO: agents could block for low-signal reasons without accountability.
5) Token/compute cost: multi-agent + intel stages increase spend.

## Mitigations
- Require Blocker Packets with minimal fixes and acceptance criteria.
- Limit amendment rounds (2), then enforce DEADLOCK protocol.
- Allow YES_WITH_RESERVATIONS to preserve concerns without blocking.
- Make “NO without blocker packet” invalid and treated as “ABSTAIN → NO (invalid)” (block + flagged).
- Use model slots to optimize cost (fast proposer, strict challenger, careful arbiter).

## Risk score
risk_score: 0.12
