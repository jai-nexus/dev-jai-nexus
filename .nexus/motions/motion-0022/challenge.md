# Challenge (motion-0022)

## Risks
- Extra filesystem reads could add minor overhead on list pages.
- Mixed bindings formatting could become noisy.

## Mitigations
- Use the same repo-root discovery + YAML parse pattern already shipped in motion-0021.
- Keep summary compact: single label (openai:gpt-5 or mixed) plus bound count.
- Optional micro-cache keyed by model-slots.yaml mtime (same as 0021) if needed.

risk_score: 0.06
