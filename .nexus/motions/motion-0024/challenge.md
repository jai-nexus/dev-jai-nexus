# Challenge (motion-0024)

## Primary concern
The main implementation risk is UI churn that accidentally reintroduces hydration mismatch on /operator/panels.

## Mitigation
- preserve server-rendered table structure
- keep <thead> and <tbody> adjacent
- avoid conditional table nesting / malformed row trees
- keep the motion limited to workflow routing and deterministic hints
