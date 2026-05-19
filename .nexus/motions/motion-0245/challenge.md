# Challenge: Device-to-Server Infrastructure Split v0

## Challenge

Clarifying device roles alongside future production classes could be misread as
authorizing local machines to serve customers, treating `jai-edge` as a
deployment authority, or prematurely selecting a production stack.

## Response

The split keeps those boundaries explicit:

- local devices remain private workflow acceleration only
- customer-serving production infrastructure remains future and separately gated
- `jai-edge` stays source-recovery/runtime-contract placeholder only
- `/home/jerryingram/edge` stays live runtime state, not a governed deployment
  target
- no server infrastructure, API behavior, auth, billing, deployment, or
  customer data handling is introduced
