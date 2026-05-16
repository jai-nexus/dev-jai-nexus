# Production Infrastructure Boundary v0

## Purpose

This artifact defines the boundary between local/dev infrastructure and future
customer-facing production infrastructure for JAI NEXUS.

It is boundary canon only. It does not select a production stack, does not
authorize deployment, and does not authorize customer workloads or customer data
collection.

## Local / Dev Infrastructure Boundary

The following are not customer-serving production infrastructure:

- Work Desktop
- MacBook
- Raspberry Pi

Personal/local machines remain limited to:

- dev lab
- runtime lab
- control-plane experimentation
- private operator infrastructure
- local validation and prototyping infrastructure

These machines are:

- not customer workloads
- not production customer-data infrastructure
- not paid-beta hosting infrastructure
- not an acceptable substitute for later external production systems

## Future Production Requirements

Future customer-facing production infrastructure requires later routed work for:

- hosted app
- production API
- managed database
- backups
- production auth
- Stripe/billing infrastructure
- logs and observability
- rate limits
- usage controls
- security/privacy review
- deployment and release process
- incident and rollback posture
- customer data handling boundary

## Explicit No-Local-Production Rule

This boundary is explicit:

- no production stack is selected by this motion
- no production stack is authorized by this motion
- no deployment is authorized by this motion
- no customer data collection is authorized by this motion
- no local machine may serve real customers

## Non-Goals

- choosing a final production provider
- deploying customer workloads
- enabling managed database infrastructure
- enabling auth or billing implementation
- collecting customer data
- mutating `jai-nexus`
- mutating `api-nexus`
- mutating any other repo

## Authority Boundary

- this artifact defines a boundary only
- it does not create infrastructure authority
- it does not authorize production hosting
- it does not authorize customer data handling
- it does not authorize deployment or runtime execution

This artifact is docs/canon/routing/planning only.
