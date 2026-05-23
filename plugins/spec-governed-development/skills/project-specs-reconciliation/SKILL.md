---
name: project-specs-reconciliation
description: Create or update conventional project PRD and ADR documentation before implementation. Use when Codex needs to reconcile requested behavior, requirements, acceptance criteria, architecture decisions, technical tradeoffs, or implementation constraints into Product Requirements Documents under docs/PRD or a user-provided scoped PRD directory and Architectural Decision Reports under docs/ADR or a user-provided scoped ADR directory. This skill is responsible for project specification documentation and hands off code execution to project-specs-implementation.
---

# Project Specs Reconciliation

Use this skill to turn a requested project change into durable project documentation before implementation begins. Create or update PRDs for product behavior and ADRs for architectural decisions.

Do not implement application code under this skill. End with a handoff for `project-specs-implementation` or another local BDD/TDD implementation workflow.

## Composition With Implementation

Use this skill for the governance red phase: establish or repair the PRD, ADR, matrix, and implementation handoff before production-code changes. Use `project-specs-implementation` for the implementation red, green, refactor, and verification phases after this skill produces a complete handoff.

If implementation work exposes missing or contradictory requirements, return to this skill before continuing code changes.

## Template Assets

Use these bundled templates when creating new specifications:

```text
assets/prd-template.md
assets/adr-template.md
```

Copy the relevant template, replace the number and title, and fill every section with project-specific content. Do not leave template placeholder prose in generated PRDs or ADRs.

## Conventional Locations

Use these locations without broad discovery:

```text
docs/PRD/
docs/ADR/
```

When the user provides an explicit scope, use:

```text
docs/<scope>/PRD/
docs/<scope>/ADR/
```

Use these conventional files when present or needed:

```text
docs/PRD/README.md
docs/PRD/MATRIX.md
docs/ADR/README.md
```

For scoped projects, place the same files below `docs/<scope>/PRD/` and `docs/<scope>/ADR/`.

Do not infer alternate spec locations by searching the repository. If the expected conventional directory is absent, create it when a new PRD or ADR is needed.

## Stage 1: Classify Intent

### Step 1: Restate the requested change

Restate the user's intent as a concise behavior or decision statement.

### Step 2: Choose PRD, ADR, or both

Use a PRD when the change affects:

- externally observable behavior
- user workflows
- product requirements
- CLI, API, UI, or integration outcomes
- acceptance criteria
- behavioral compatibility

Use an ADR when the change records:

- a durable architecture decision
- system boundaries
- dependency or framework choices
- execution model changes
- data ownership or persistence strategy
- security, reliability, or operational tradeoffs
- constraints that future implementation must preserve

Use both when an architecture decision changes product behavior. In that case, create or update the ADR first, then create or update the PRD with behavioral consequences and acceptance criteria.

### Step 3: State the classification

Before editing files, state:

- whether the work is PRD-only, ADR-only, or both
- the conventional directory that will be used
- whether the change updates an existing spec or creates a new one

## Stage 2: Select the Spec Path

### Step 1: Resolve the base directory

Use `docs/PRD/` and `docs/ADR/` unless the user gives an explicit scope. If the user gives `payments` as the scope, use `docs/payments/PRD/` and `docs/payments/ADR/`.

### Step 2: Read only conventional indexes and candidate specs

Read the relevant `README.md` index in the selected conventional directory when it exists. Read candidate PRDs or ADRs in that same directory when deciding whether an existing durable owner already exists.

### Step 3: Decide update versus create

Update an existing spec when its concern boundary already owns the behavior or decision. Create a new spec only when no existing spec in the conventional location owns the requested concern.

### Step 4: Choose the next number

For a new PRD, use:

```text
PRD-<4-digit>-<slug>-specification.md
```

For a new ADR, use:

```text
ADR-<4-digit>-<slug>.md
```

Choose the next number from the selected conventional directory or from explicit numbering guidance in the local index.

## Stage 3: Create or Update PRDs

Use this stage for product behavior, requirements, acceptance criteria, and user-observable outcomes.

### Step 1: Preserve the owning concern boundary

Keep each PRD focused on one stable product, subsystem, feature-family, or mechanism boundary. Reference another PRD instead of duplicating acceptance criteria when another PRD already owns the behavior.

### Step 2: Use the PRD template

For new PRDs, copy `assets/prd-template.md` and fill it in. The template defines this required structure:

```markdown
# PRD-0000: Title Specification

## Status

Draft

## Context

## Goals

## Non-Goals

## Contract

## Deferred Scope

## Acceptance Scenarios
```

Adapt headings only when the repository already has a stricter local PRD template in the conventional directory.

### Step 3: Write external behavior

Write behavior as observable outcomes, not implementation detail. Prefer concrete inputs, user actions, system responses, persistence outcomes, compatibility guarantees, and failure modes.

### Step 4: Maintain acceptance scenarios

Use scenario IDs in this form:

```text
SCN-0000
```

Increment scenario IDs within the PRD. Preserve existing IDs when updating behavior unless a deliberate migration is documented.

Use this scenario shape:

```markdown
### Scenario SCN-0000: Observable behavior title

Given ...
When ...
Then ...
```

Keep scenario titles stable when behavior is unchanged.

### Step 5: Mark intentionally deferred behavior

Record visible but intentionally unimplemented behavior under `Deferred Scope` instead of silently expanding the contract.

## Stage 4: Create or Update ADRs

Use this stage for architectural decisions, durable tradeoffs, and implementation constraints.

### Step 1: Capture the decision, not just the result

Explain why the decision is durable and what tradeoffs it creates. Do not use an ADR as a generic implementation note.

### Step 2: Use the ADR template

For new ADRs, copy `assets/adr-template.md` and fill it in. The template defines this required structure:

```markdown
# ADR-0000: Decision Title

## Status

Proposed

## Context

## Decision

## Consequences

## Alternatives Considered

## Related Specifications
```

Adapt headings only when the repository already has a stricter local ADR template in the conventional directory.

### Step 3: Link behavior when needed

When the decision changes product behavior, link the related PRD under `Related Specifications` and ensure the PRD captures the observable contract.

### Step 4: Record constraints for implementation

Make constraints explicit enough for implementation work to preserve them, including boundaries, dependency choices, data ownership, failure handling, operational requirements, or compatibility expectations.

## Stage 5: Update Indexes and Traceability

### Step 1: Update PRD and ADR indexes

Update `README.md` in the touched conventional PRD or ADR directory when it exists or when creating the first spec in that directory.

For PRD indexes, include the current PRDs and any numbering guidance needed for future additions.

For ADR indexes, include the current ADRs and the next ADR number when helpful.

### Step 2: Update a traceability matrix only when present

If `MATRIX.md` already exists in the selected PRD directory, update it for new or changed PRD acceptance scenarios. Do not create a matrix unless the user asks for one or the repository already uses it in that conventional directory.

### Step 3: Keep traceability mechanical

When a matrix exists, keep scenario IDs, PRD scenario titles, and mapped executable scenario titles aligned as tightly as the project permits. Document any intentional mismatch in the matrix notes.

## Stage 6: Validate and Handoff

### Step 1: Run documented spec validation first

If the touched conventional directory documents a validation command, run it. Treat failures as blockers unless the user explicitly asks for a partial draft.

### Step 2: Perform structural validation

When no validator exists, check:

- filenames match the required PRD or ADR pattern
- indexes include new or renamed specs
- PRD scenario IDs are unique and sequential within each PRD
- PRD scenario titles are stable and externally observable
- ADRs link related PRDs when behavior is affected
- matrix rows stay aligned when `MATRIX.md` exists

### Step 3: Produce the implementation handoff

End with a handoff for `project-specs-implementation` in this shape:

```text
implementation_handoff:
  classification:
  spec_paths:
  behavior_owner:
  architecture_decisions:
  acceptance_scenarios:
  expected_red_tests:
  implementation_constraints:
  verification_commands:
  open_questions:
```

Use `none` for fields that do not apply. Keep the handoff factual and implementation-ready.
