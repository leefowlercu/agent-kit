---
name: project-specs-implementation
description: Implement code changes from reconciled project PRDs, ADRs, traceability matrices, executable acceptance scenarios, or a project-specs-reconciliation implementation handoff. Use after project-specs-reconciliation has created or updated the governing specs, or when the user explicitly says the specs are already reconciled. This skill owns the spec-to-test-to-code workflow and composes with language-specific TDD, BDD, and red-green-refactor skills without replacing their framework-specific guidance.
---

# Project Specs Implementation

Use this skill to implement a project change after the governing PRD or ADR has been reconciled. Consume the `implementation_handoff` from `project-specs-reconciliation` when available.

Do not use this skill to invent or rewrite product requirements. If the requested behavior is not covered by a reconciled PRD, ADR, traceability matrix, or explicit user-provided handoff, stop and use `project-specs-reconciliation` first.

## Composition Contract

This skill owns:

- consuming the reconciled spec handoff
- mapping PRD acceptance scenarios to executable tests
- preserving PRD, matrix, Gherkin, and test traceability
- sequencing implementation through governance red, implementation red, green, refactor, and verification
- reporting implementation results back against the governing specs

Use language-specific or repository-specific skills for:

- test framework idioms
- fixture and mock patterns
- exact red-green-refactor mechanics
- package, module, or command layout
- style and lint conventions
- build, run, and debugger workflows

Treat the workflow as two red phases:

```text
governance red: reconciled PRD, ADR, matrix, or handoff exists before code changes
implementation red: executable acceptance, integration, or unit tests fail for the intended behavior
```

## Stage 1: Confirm Governance Inputs

### Step 1: Read local instructions

Read applicable local instructions before changing code. Prefer nearer-scope repository guidance over this skill when they conflict.

### Step 2: Locate the governing specs

Use the paths from the `implementation_handoff` when present. Otherwise use the conventional locations from `project-specs-reconciliation`:

```text
docs/PRD/
docs/ADR/
docs/<scope>/PRD/
docs/<scope>/ADR/
```

Read only the relevant PRDs, ADRs, `README.md` indexes, and `MATRIX.md` files needed to understand the requested implementation.

### Step 3: Check for a valid handoff

Confirm the implementation has:

- a behavior owner
- relevant PRD or ADR paths
- acceptance scenarios or explicit verification expectations
- expected red tests or a clear reason no new test is needed
- implementation constraints

If any required input is absent or contradictory, pause implementation and run `project-specs-reconciliation` to repair the governing spec first.

## Stage 2: Build the Traceability Map

### Step 1: Map specs to executable coverage

For each impacted PRD scenario, identify the executable artifact that should prove it:

- Gherkin feature scenario when the repo uses acceptance features
- integration test when behavior crosses system boundaries
- unit test when the behavior is local and implementation-focused
- documented manual verification only when automation is impossible or explicitly deferred

### Step 2: Preserve stable identifiers

Keep existing scenario IDs, scenario titles, matrix rows, and executable scenario names stable when the behavior is unchanged. When adding coverage, use the naming and numbering scheme already present in the conventional spec directory.

### Step 3: Identify the narrow implementation surface

Inspect the code paths needed to satisfy the mapped scenarios. Avoid unrelated refactors and avoid broad rewrites that are not required by the governing specs.

## Stage 3: Create the Implementation Red

### Step 1: Update executable acceptance coverage first

When the project uses Gherkin or acceptance tests, create or update the executable scenario before production code changes. Align scenario titles with the PRD and matrix as tightly as the local project permits.

### Step 2: Add lower-level failing tests as needed

Use local TDD or language-specific skill guidance to add focused unit or integration tests for the implementation boundary. Keep these tests tied to the acceptance scenario or constraint they support.

### Step 3: Run the narrow failing check

Run the smallest useful test command and confirm it fails for the intended missing behavior. If a failing test cannot be produced before code changes, document why and keep the implementation surface smaller than usual.

## Stage 4: Implement and Refactor

### Step 1: Make the minimum production change

Implement only the behavior required by the governing specs and failing tests. Preserve architecture constraints from related ADRs.

### Step 2: Run the green check

Rerun the previously failing checks and fix the implementation until they pass. Add broader tests only when the change crosses shared contracts or user-visible workflows.

### Step 3: Refactor with traceability intact

Refactor only after the green check passes. Keep test names, scenario titles, matrix rows, and spec references aligned after moving or renaming artifacts.

### Step 4: Reconcile discovered spec drift

If implementation reveals that the spec is wrong, incomplete, or impossible as written, stop and use `project-specs-reconciliation` to update the PRD or ADR before continuing.

## Stage 5: Verify and Report

### Step 1: Run documented validation

Run the validation commands named in the handoff, touched spec directory, local instructions, or changed package. Prefer targeted commands first, then broader checks when risk justifies them.

### Step 2: Check structural traceability

Before finishing, verify:

- implemented behavior maps back to the governing PRD scenarios
- ADR constraints are preserved
- matrix rows still point to current executable artifacts when a matrix exists
- deferred scope remains unimplemented unless the specs were updated
- no unrelated documentation or code churn was introduced

### Step 3: Produce the implementation report

End with a concise report in this shape:

```text
implementation_report:
  spec_paths:
  acceptance_artifacts:
  tests_added_or_changed:
  implementation_summary:
  verification_commands:
  traceability_notes:
  follow_ups:
```

Use `none` for fields that do not apply. Include failed or skipped verification commands with the reason.
