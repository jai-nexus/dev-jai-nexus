# Challenge (motion-0058)

## Risks
- Adding a second provider increases the code surface in motion-factory.mjs.
  Two API integration paths means two potential failure modes.
- The Anthropic Messages API has a different response shape than OpenAI
  Responses API. Parsing differences could introduce subtle bugs.
- Operator confusion about which provider is active if stdout does not
  clearly indicate the selected provider.
- Anthropic API availability may not be stable if credit or access issues
  recur.

## Objections
- The code surface increase is bounded: provider-specific API call functions
  and a routing switch. The existing structure (system prompts, output
  parsing, file writing, atomic writes) is shared.
- Response shape differences are handled by provider-specific extraction
  functions. The rest of the pipeline operates on the same normalized
  output regardless of provider.
- Stdout includes the provider name in every command's output summary,
  making the selection visible.
- Anthropic availability is validated during execution. If the API is
  unavailable, the OpenAI default path continues to work.

## Mitigations
- Provider-specific API functions are isolated. Shared logic (prompts,
  file writing, atomic writes) is not duplicated.
- Each provider has its own key check. Missing keys fail before any writes.
- Stdout notes which provider was used for every command.
- Existing test patterns (error cases, atomic writes, scope guards) apply
  to both providers.
- OpenAI default path is unchanged and serves as fallback.

## Required gates
- validate_motion
- validate_agency

## Risk score
risk_score: 0.05
