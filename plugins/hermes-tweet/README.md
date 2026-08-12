# Hermes Tweet Plugin

Guide Hermes Agent X/Twitter workflows with read-first discovery and approval-gated actions.

**Version**: 0.1.11
**License**: MIT

## Overview

This plugin helps Claude Code and Codex prepare Hermes Agent workflows. It selects discovery, read, or action tools without exposing credentials or silently changing account state.

## Installation

Claude Code:

```bash
/plugin install hermes-tweet@leefowlercu-agent-kit
```

Codex from the repository root:

```bash
codex plugin marketplace add .
```

Restart Codex, then install `hermes-tweet` from Lee Fowler Agent Kit.

## Usage

Invoke the skill before a Hermes Agent X/Twitter workflow:

```text
/hermes-tweet
$hermes-tweet
```

## Included Components

| Component | Type | Description |
|-----------|------|-------------|
| `hermes-tweet` | Skill | Selects safe discovery, read, and action workflows |

## Requirements

- Hermes Agent with the upstream `hermes-tweet` plugin enabled
- `XQUIK_API_KEY` in the Hermes runtime for authenticated reads
- `HERMES_TWEET_ENABLE_ACTIONS=true` only when actions are intended

## Documentation

- [Skill workflow](skills/hermes-tweet/SKILL.md)
- [Upstream plugin](https://github.com/Xquik-dev/hermes-tweet)
- [PyPI package](https://pypi.org/project/hermes-tweet/)
