# Challenge: Toolchain Integration Readiness Matrix v0

## Challenge

Combining `jai-pilot`, `vscode-nexus`, and `api-nexus` in one readiness matrix
could be misread as authorizing runtime Toolchain integration, elevating
Toolchain events to global SoT, or promoting `api-nexus` raw JSONL beyond
repo-local ingress evidence.

## Response

The matrix keeps those boundaries explicit:

- Toolchain lane ownership is documented, not expanded
- runtime integration remains not authorized
- Toolchain events and client payloads are not global SoT by default
- `api-nexus` raw JSONL remains repo-local ingress evidence only
- no API expansion, event ingestion behavior, live polling, or execution
  authority is introduced
