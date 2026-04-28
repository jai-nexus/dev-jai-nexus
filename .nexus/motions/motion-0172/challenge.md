# Motion 0172 Challenge

## Main risks

- planning language could drift into implicit implementation authority
- billing and auth assumptions could be mistaken for approved integration work
- repo-facing handoff could look like a runnable execution packet

## Required mitigations

- keep the seam repo-facing and planning-only
- make Stripe/auth/DB/API deferrals explicit
- make deferred execution authority explicit in both wave and planning capture
- keep jai-nexus untouched in this seam
