# Bro Plugin

Restates the assistant's previous message in plain, concise language.

**Version**: 0.1.0
**License**: MIT

## Overview

This plugin provides one manually invoked `bro` skill for turning an overly technical, wordy, or jargon-heavy response into plain human language. It preserves the original meaning and important details while making the response simpler, shorter, and easier to understand.

Claude Code and Codex share the same skill definition. Claude Code reads `disable-model-invocation` from `SKILL.md`, while Codex ignores that unsupported frontmatter field and reads `allow_implicit_invocation` from `agents/openai.yaml`.

## Installation

Claude Code:

```bash
/plugin install bro@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Then restart Codex and install `bro` from the `Lee Fowler Agent Kit` marketplace in the plugin directory.

## Usage

Invoke `bro` immediately after a response that should be clearer or more concise:

```text
/bro:bro
$bro
```

Claude Code and Codex both require explicit invocation; the skill is not selected automatically.

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `bro` | Skill | Restates the assistant's previous message in plain, concise language without jargon |

## Requirements

No external dependencies required.

## Documentation

See [skills/bro/SKILL.md](skills/bro/SKILL.md) for the shared skill instructions.
