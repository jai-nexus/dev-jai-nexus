# Challenge: Edge Runner Automation Substrate Intake v0

## Challenge

The main risk is that visibility into a tested dry-run substrate could be
misread as permission to execute plans or automate cross-repo actions.

## Response

This intake keeps the posture explicit:

- dry-run generation only
- validation only
- human review only
- execution denied
- scheduler denied
- automation execution denied

That preserves visibility without implying authority.
