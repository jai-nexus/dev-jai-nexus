# JAI Toolchain Product-Foundry Routing

## Thesis

JAI Toolchain is the product-foundry layer for creating a string of developer
products.

The superobjective is to become one of the most sophisticated governed
intelligence systems in the world while also producing developer products that
express that system.

## Routing posture

`dev-jai-nexus` coordinates operator visibility and routing. It does not own
every product/domain surface.

Likely routing map:
- `dev-jai-nexus`
  - control-plane visibility
  - cross-repo routing
  - staged governance posture
- `audit-nexus`
  - audit/hygiene/state-direction review posture
- `docs-nexus`
  - documentation, source intelligence, agent assets, context packs
- `jai`
  - portable substrate and shared semantics
- `jai-nexus`
  - customer/product/operator app surfaces
- `api-nexus`
  - integration contracts and interfaces
- `jai-format`
  - formatting and representation discipline
- `jai-pilot`
  - future developer-product lane
- `vscode-nexus`
  - future editor/product lane
- future toolchain repos
  - additional developer-product lanes under later governance

## Authority posture

Product-foundry expansion remains staged and motion-gated.

Nothing in this routing document authorizes:
- execution
- branch write
- PR creation
- scheduler/automation
- provider/model runtime
- mutation authority
