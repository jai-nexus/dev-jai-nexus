# Challenge (motion-0026)

## Primary concern
The main risk is creating operator actions that partially update packet state without coherently updating inbox and SoT history.

## Mitigation
- centralize execution-loop actions in shared helper(s)
- make operator actions server-side only
- update packet status, inbox state, and SoT emissions together
- preserve explicit operator approval boundaries
