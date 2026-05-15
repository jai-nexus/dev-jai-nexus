# Challenge: Motion Governance Schema Hygiene v0

## Risks

- schema-era notes could accidentally be read as retroactive normalization of
  all Corpus V1 records
- modern governance voter identities could be conflated with execution/lens
  labels again
- Corpus V2 could inherit Corpus V1 ambiguity if the distinction remains soft

## Mitigations

- state explicitly that historical outcomes are not rewritten
- separate execution/lens labels from governance voter identities in canon
- document PR `#151` as a hygiene fix rather than a governance-era reset
- keep the seam read-only, canon-only, and backward-compatible
