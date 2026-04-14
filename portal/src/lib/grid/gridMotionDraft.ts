// portal/src/lib/grid/gridMotionDraft.ts
//
// Pure motion-draft scaffold generator for Grid structural diffs (motion-0130).
// Consumes StructuralDiff from gridDiff.ts and produces a MotionDraftScaffold —
// all four motion package file contents as strings, ready for operator copy.
//
// Design invariants:
//   - Pure: no server-only imports, no fs writes, no side effects.
//   - Deterministic: same StructuralDiff input → identical scaffold output.
//   - Hand-built strings: no template library dependency.
//   - Operator mediation preserved: files are copy-only, nothing is auto-committed.
//
// Operator flow:
//   buildMotionDraftScaffold(diff)
//     → MotionDraftScaffold { motionYaml, proposalMd, executionMd, challengeMd }
//     → MotionDraftModal (copy each section into .nexus/motions/motion-XXXX/)
//     → validate-motion gate catches schema errors before commit

import type { StructuralDiff, NormalizedPositionChange } from "./gridDiff";
import type { ConnectionChange } from "./gridDraft";

// ── Public types ──────────────────────────────────────────────────────────────

export interface MotionDraftScaffold {
  motionYaml: string;
  proposalMd: string;
  executionMd: string;
  challengeMd: string;
  generatedAt: string;
  changesSummary: ChangesSummary;
}

export interface ChangesSummary {
  positionChanges: number;
  connectionChanges: number;
  derivedTitle: string;
}

export interface MotionDraftOpts {
  /** Default: "6.0.1" */
  proposer_nh_id?: string;
  /** Default: "6.0" */
  council_nh_id?: string;
  /** Default: "q2-corpus-v2-live-value-loop" */
  program?: string;
}

// ── Root function ─────────────────────────────────────────────────────────────

export function buildMotionDraftScaffold(
  diff: StructuralDiff,
  opts: MotionDraftOpts = {},
): MotionDraftScaffold {
  const generatedAt = diff.generatedAt;
  const summary = buildChangesSummary(diff);
  const resolvedOpts = resolveOpts(opts);

  return {
    motionYaml:  buildMotionYaml(summary, generatedAt, resolvedOpts),
    proposalMd:  buildProposalMd(diff, summary, generatedAt),
    executionMd: buildExecutionMd(summary, generatedAt),
    challengeMd: buildChallengeMd(summary),
    generatedAt,
    changesSummary: summary,
  };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

interface ResolvedOpts {
  proposer_nh_id: string;
  council_nh_id: string;
  program: string;
}

function resolveOpts(opts: MotionDraftOpts): ResolvedOpts {
  return {
    proposer_nh_id: opts.proposer_nh_id ?? "6.0.1",
    council_nh_id:  opts.council_nh_id  ?? "6.0",
    program:        opts.program        ?? "q2-corpus-v2-live-value-loop",
  };
}

function buildChangesSummary(diff: StructuralDiff): ChangesSummary {
  const pc = diff.positionChanges.length;
  const cc = diff.connectionChanges.length;

  const parts: string[] = [];
  if (pc > 0) parts.push(`${pc} zone reassignment${pc !== 1 ? "s" : ""}`);
  if (cc > 0) parts.push(`${cc} connection${cc !== 1 ? "s" : ""}`);

  const derivedTitle =
    parts.length > 0
      ? `Grid structural changes: ${parts.join(", ")}`
      : "Grid structural changes (no changes staged)";

  return { positionChanges: pc, connectionChanges: cc, derivedTitle };
}

// ── motion.yaml ───────────────────────────────────────────────────────────────

function buildMotionYaml(
  summary: ChangesSummary,
  generatedAt: string,
  opts: ResolvedOpts,
): string {
  const lines: string[] = [];
  lines.push(`protocol_version: "0.3.8"`);
  lines.push(`# Replace XXXX with the next available motion ID before committing.`);
  lines.push(`motion_id: motion-XXXX`);
  lines.push(`kind: builder-proof`);
  lines.push(`status: proposed`);
  lines.push(`title: "${summary.derivedTitle}"`);
  lines.push(`program: ${opts.program}`);
  lines.push(`proposer_nh_id: "${opts.proposer_nh_id}"`);
  lines.push(`council_nh_id: "${opts.council_nh_id}"`);
  lines.push(`target:`);
  lines.push(`  repo: dev-jai-nexus`);
  lines.push(`  domain: dev.jai.nexus`);
  lines.push(`required_gates: [validate_motion, validate_agency, typecheck]`);
  lines.push(`checks_required: [typecheck]`);
  lines.push(`checks_optional: []`);
  lines.push(`created_at: "${generatedAt}"`);
  return lines.join("\n");
}

// ── proposal.md ───────────────────────────────────────────────────────────────

function buildProposalMd(
  diff: StructuralDiff,
  summary: ChangesSummary,
  generatedAt: string,
): string {
  const date = generatedAt.slice(0, 10);
  const lines: string[] = [];

  lines.push(`# Proposal: ${summary.derivedTitle}`);
  lines.push(``);
  lines.push(`**Motion:** motion-XXXX`);
  lines.push(`**Kind:** builder-proof`);
  lines.push(`**Program:** q2-corpus-v2-live-value-loop`);
  lines.push(`**Date:** ${date}`);
  lines.push(`**Basis:** canonical-v0 (motion-0129)`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(
    `This motion applies ${summary.positionChanges} position change${summary.positionChanges !== 1 ? "s" : ""} and ` +
    `${summary.connectionChanges} connection change${summary.connectionChanges !== 1 ? "s" : ""} to the ` +
    `JAI NEXUS agent topology, as drafted in Grid Configuration Mode (motion-0129 surface).`,
  );
  lines.push(``);
  lines.push(`---`);

  // Position changes
  lines.push(``);
  if (diff.positionChanges.length > 0) {
    lines.push(`## Position changes`);
    lines.push(``);
    lines.push(`| Agent | nh\_id | From zone | From rank | To zone | To rank |`);
    lines.push(`|---|---|---|---|---|---|`);
    for (const c of diff.positionChanges) {
      lines.push(
        `| ${c.agentLabel} | \`${c.nhId}\` | ${c.fromZone} | ${c.fromRank} | ${c.toZone} | ${c.toRank} |`,
      );
    }
  } else {
    lines.push(`## Position changes`);
    lines.push(``);
    lines.push(`*(none)*`);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(``);

  // Connection changes
  if (diff.connectionChanges.length > 0) {
    lines.push(`## Connection changes`);
    lines.push(``);
    lines.push(`| Source | Source nh\_id | Type | Target | Target nh\_id |`);
    lines.push(`|---|---|---|---|---|`);
    for (const c of diff.connectionChanges) {
      lines.push(
        `| ${c.sourceLabel} | \`${c.sourceNhId}\` | ${c.type} | ${c.targetLabel} | \`${c.targetNhId}\` |`,
      );
    }
  } else {
    lines.push(`## Connection changes`);
    lines.push(``);
    lines.push(`*(none)*`);
  }

  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Why these changes`);
  lines.push(``);
  lines.push(`[Operator to complete: explain the intent behind these structural changes]`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Success criteria`);
  lines.push(``);

  let scIdx = 1;
  if (diff.positionChanges.length > 0) {
    lines.push(
      `- **SC-${scIdx}** All ${diff.positionChanges.length} position reassignment${diff.positionChanges.length !== 1 ? "s" : ""} applied to canonical agent roster`,
    );
    scIdx++;
  }
  if (diff.connectionChanges.length > 0) {
    lines.push(
      `- **SC-${scIdx}** All ${diff.connectionChanges.length} connection change${diff.connectionChanges.length !== 1 ? "s" : ""} validated and applied`,
    );
    scIdx++;
  }
  lines.push(`- **SC-${scIdx}** \`pnpm -C portal typecheck\` exits 0`);

  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Non-goals`);
  lines.push(``);
  lines.push(`- Automatic ratification or canon writes`);
  lines.push(`- Live Ops / telemetry surface changes`);
  lines.push(`- Changes beyond the position and connection changes listed above`);

  return lines.join("\n");
}

// ── execution.md ──────────────────────────────────────────────────────────────

function buildExecutionMd(summary: ChangesSummary, generatedAt: string): string {
  const date = generatedAt.slice(0, 10);
  const lines: string[] = [];

  lines.push(`# Execution: ${summary.derivedTitle}`);
  lines.push(``);
  lines.push(`**Motion:** motion-XXXX`);
  lines.push(`**Role:** BUILDER`);
  lines.push(`**Date:** ${date}`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Deliberation protocol tier`);
  lines.push(``);
  lines.push(`**Tier 1:** kind:builder-proof, cost:standard → evidence-falsifiability mandatory.`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Scope`);
  lines.push(``);
  lines.push(`[Operator to complete: list the files that will be modified when this motion is applied]`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Evidence log`);
  lines.push(``);
  lines.push(`*(Populated during proof execution)*`);

  return lines.join("\n");
}

// ── challenge.md ──────────────────────────────────────────────────────────────

function buildChallengeMd(summary: ChangesSummary): string {
  const lines: string[] = [];

  lines.push(`# Challenge: ${summary.derivedTitle}`);
  lines.push(``);
  lines.push(`**Motion:** motion-XXXX`);
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Risks`);
  lines.push(``);
  lines.push(
    `- **R-1: Structural changes not validated against runtime constraints** — ` +
    `connection and position changes declared in this motion have been validated ` +
    `structurally by Grid Configuration Mode (connectionValidator.ts). Runtime ` +
    `compatibility is the operator's responsibility.`,
  );
  lines.push(``);
  lines.push(`---`);
  lines.push(``);
  lines.push(`## Required gates`);
  lines.push(``);
  lines.push(`- validate_motion`);
  lines.push(`- validate_agency`);
  lines.push(`- typecheck`);
  lines.push(``);
  lines.push(`## Risk score`);
  lines.push(``);
  lines.push(`risk_score: 0.15`);

  return lines.join("\n");
}
