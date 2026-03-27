# Challenge (motion-0029)

## Primary concern
If execution eligibility is not made explicit in configuration, the system will continue to rely on inference from broad registry data and may assign governance-only agents into execution-lane flows.

## Secondary concern
If the config change is too aggressive, legacy work packets may render incorrectly or disappear from assignment views.

## Mitigation
- use config as canonical truth for execution eligibility
- preserve graceful fallback rendering for legacy packets
- treat invalid role/assignee combinations as visible mismatches instead of silent failures
- keep the motion scoped to config + work assignment semantics only
