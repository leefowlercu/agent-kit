# Goalcraft Plugin

Turns rough drafts into powerful Codex `/goal` objectives for long-running autonomous work.

**Version**: 0.1.0
**License**: MIT

## Overview

This Codex-only plugin provides one `goalcraft` skill for shaping rough task briefs into compact, activation-ready `/goal` objectives. It helps define scope, preservation rules, verification gates, done criteria, stop conditions, and length-safe goal text that Codex can follow independently.

## Installation

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `goalcraft` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

This plugin is not published in the Claude Code marketplace because Codex `/goal` is a Codex-only feature.

## Usage

Invoke the `goalcraft` skill when you want to create or refine a Codex `/goal` prompt for long-running work.

Example prompts:

```text
Use $goalcraft to turn this rough draft into an activation-ready Codex /goal objective.
Use $goalcraft to improve this /goal so Codex knows when to stop.
Use $goalcraft to stress-test this goal before I set it.
```

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `goalcraft` | Skill | Turns rough drafts into compact Codex `/goal` objectives with objective, scope, preservation rules, verification gates, done criteria, and stop conditions |
| `references/codex-goal-contract.md` | Reference | Documents Codex `/goal` slash, tool, continuation, budget, and app-server behavior |
| `scripts/validate_goal_length.js` | Script | Validates the generated `/goal` objective against Codex character targets and hard limits |

## Requirements

- Codex with plugin support
- Codex CLI `/goal` enabled via `/experimental` or `[features] goals = true`
- Node.js when running the bundled length validator

## Documentation

See [skills/goalcraft/SKILL.md](skills/goalcraft/SKILL.md) for the skill workflow. This skill content is vendored from [grp06/goalcraft](https://github.com/grp06/goalcraft).
