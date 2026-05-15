# Corpus Model v0

## Purpose

Define Corpus as a first-class governance era model for `dev-jai-nexus`.

## Corpus definition

A Corpus is a bounded governance era with its own motion sequence, governance
posture, operability assumptions, and historical boundary. Corpus history is
preserved across eras, but each Corpus may define a new motion-numbering base
without rewriting prior records.

## Corpus identity fields

Every Corpus record should define:

- `corpus_id`
- `corpus_label`
- `motion_numbering_base`
- `governance_posture`
- `agent_operability_posture`
- `opened_at`
- `closed_at`
- `status`

## Era policy

- Each Corpus is a governance era, not merely a motion range.
- A new Corpus may reset motion numbering to `motion-0001`.
- Resetting numbering for a new Corpus does not rename, overwrite, or mutate
  prior Corpus records.
- Prior Corpus records remain preserved, searchable, historically canonical,
  and immutable except through explicit hygiene fixes.
- Hygiene fixes may correct canon drift, formatting issues, or record-shape
  defects, but they do not retroactively reopen the prior Corpus.

## Corpus V1

Corpus V1 is the manual-governance era.

Identity posture:

- `corpus_id`: `corpus-v1`
- `corpus_label`: `Corpus V1`
- `motion_numbering_base`: `motion-0001`
- `governance_posture`: `manual governance`
- `agent_operability_posture`: `not agent-operable`
- `status`: `active_closing`

Corpus V1 characteristics:

- manual motions
- external chat-driven passalongs
- human-operated `CONTROL_THREAD`
- human-mediated repo execution
- manual ratification records
- early governance schema evolution
- no live JAI Agent voting
- no autonomous execution authority

## Corpus V2

Corpus V2 is the future agent-operable governance era.

Intended posture:

- `corpus_id`: `corpus-v2`
- `corpus_label`: `Corpus V2`
- `motion_numbering_base`: `motion-0001`
- `governance_posture`: `agent-operable governance`
- `agent_operability_posture`: `gated_until_open`
- `status`: `gated`

Corpus V2 goals:

- JAI Agents can draft motions internally to `dev.jai.nexus`
- JAI Agents can vote using canonical governance voter identities
- ratification is visible and governed
- motion outputs become workflow-ready without granting hidden authority

## Current status

Corpus V2 is not open yet.

This model defines the era boundary and reset policy only. It does not open
Corpus V2, does not reset numbering yet, and does not authorize live agent
voting or execution.
