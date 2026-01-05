# Spec Interviewer Planner Plugin

Commands for interviewing about specifications and generating implementation plans.

**Version**: 0.1.1
**License**: MIT

## Overview

This plugin provides two commands that work together in a specification-driven development workflow. The interviewer command helps gather detailed requirements through structured questioning, while the planner command generates actionable implementation plans from specifications.

## Installation

Install from marketplace:

```bash
/install spec-interviewer-planner@leefowlercu-agent-kit
```

## Usage

### Specification Interviewer

Run the interviewer to gather detailed requirements for your specification:

```bash
/spec-interviewer
```

The command reads `SPEC.md` from your current directory, analyzes the codebase to understand its architecture and patterns, and then conducts an in-depth interview covering technical implementation, UI/UX, concerns, tradeoffs, and edge cases. After the interview, it updates `SPEC.md` with the gathered details.

### Specification Planner

Run the planner to generate an implementation plan:

```bash
/spec-planner
```

The command analyzes your codebase, reads `SPEC.md`, and generates `PLAN.md` containing a structured implementation plan and a to-do style checklist.

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| spec-interviewer | Command | Interview user about SPEC.md to gather detailed implementation requirements |
| spec-planner | Command | Generate implementation plan from SPEC.md after analyzing codebase |

## Requirements

- A `SPEC.md` file in the current working directory containing the specification to be interviewed or planned

## Workflow

1. Create a `SPEC.md` file with your initial specification
2. Run `/spec-interviewer` to refine the specification through detailed questioning
3. Run `/spec-planner` to generate an implementation plan in `PLAN.md`
4. Follow the checklist in `PLAN.md` during implementation
