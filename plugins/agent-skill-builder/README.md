# Agent Skill Builder Plugin

A Claude Code plugin for creating Agent Skills of varying complexity levels.

**Version**: 0.1.0
**License**: MIT

## Overview

This plugin provides tooling and guidance for building Agent Skills. It includes a meta-skill that walks users through the complete skill creation process, from requirements gathering through validation and iteration.

## Installation

Install from the Agent Kit marketplace:

```bash
/plugin install agent-skill-builder@leefowlercu-agent-kit
```

## Usage

After installation, invoke the skill naturally:

- "Help me create a new Agent Skill"
- "I want to build a skill that generates reports"
- "Create an Agent Skill for code review"

## Included Components

### Skills

| Skill | Description |
|-------|-------------|
| [agent-skill-builder](skills/agent-skill-builder/) | Guides creation of Agent Skills using simple, moderate, or complex archetypes |

## Skill Archetypes

The plugin supports three complexity levels:

| Archetype | Use Case |
|-----------|----------|
| **Simple** | Single SKILL.md with inline instructions |
| **Moderate** | SKILL.md with separate reference files |
| **Complex** | Full Phase/Stage/Step hierarchy with schemas and scripts |

## Requirements

- Claude Code with plugin support
- Node.js (for validation scripts)

## Documentation

For detailed skill documentation, see [skills/agent-skill-builder/README.md](skills/agent-skill-builder/README.md).
