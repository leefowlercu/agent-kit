# Agent Skill Builder

An Agent Skill that assists in creating Agent Skills of varying complexity levels.

## Overview

This skill guides users through the complete process of building Agent Skills, from requirements gathering through validation and iteration. It supports three archetype complexity levels:

- **Simple**: Single SKILL.md file with inline instructions
- **Moderate**: SKILL.md with separate reference files for detailed guidance
- **Complex**: Full Phase/Stage/Step hierarchy with schemas, scripts, and validation

## Installation

Copy this skill directory to your Claude Code skills directory:

```bash
cp -r ./agent-skill-builder ~/.claude/skills/agent-skill-builder
```

## Usage

Invoke the skill by asking Claude to help create an Agent Skill:

- "Help me create a new Agent Skill"
- "I want to build a skill that generates reports"
- "Create an Agent Skill for code review"

## Workflow Structure

The skill follows a five-phase workflow:

### Phase 1: Discovery
- **Stage 1: Requirements Gathering** - Collect skill purpose, triggers, and complexity indicators
- **Stage 2: Analysis** - Determine appropriate archetype based on requirements

### Phase 2: Planning
- **Stage 3: Design** - Create detailed structure plan for the skill

### Phase 3: Implementation
- **Stage 4: Foundation** - Generate the main SKILL.md file
- **Stage 5: References** - Generate workflow references and schemas
- **Stage 6: Automation** - Generate validation and automation scripts

### Phase 4: Validation
- **Stage 7: Quality Assurance** - Validate generated skill against best practices

### Phase 5: Iteration
- **Stage 8: Refinement** - Iterate based on user feedback

## Directory Structure

```
budapest/
├── SKILL.md                    # Main skill definition
├── README.md                   # This file
├── references/
│   ├── workflow/               # Workflow step references (flat structure)
│   ├── schemas/                # JSON validation schemas
│   │   ├── skill-requirements.schema.json
│   │   └── skill-structure.schema.json
│   └── templates/              # Archetype templates
│       ├── simple/
│       ├── moderate/
│       └── complex/
└── scripts/                    # Validation scripts (Node.js)
    ├── validate-json.js
    └── validate-skill.js
```

## Validation Scripts

### validate-skill.js

Validates an Agent Skill directory for compliance with best practices:

```bash
node scripts/validate-skill.js /path/to/skill
```

Checks performed:
- Frontmatter validation (name, description constraints)
- Structure validation (file existence, line counts, reference resolution)
- Content validation (third-person voice, required sections)
- Script syntax validation
- Schema validation

### validate-json.js

Validates JSON files against JSON Schema (Draft 2020-12):

```bash
node scripts/validate-json.js --schema <schema-file> --instance <json-file>
```

Example:
```bash
node scripts/validate-json.js \
  --schema references/schemas/skill-requirements.schema.json \
  --instance skill-requirements.json
```

## Archetype Selection

The skill helps determine the appropriate archetype based on complexity indicators:

| Indicator | Simple | Moderate | Complex |
|-----------|--------|----------|---------|
| Multi-step workflow | No | Yes | Yes |
| Validation between steps | No | No | Yes |
| Automation scripts | No | No | Yes |
| Reference files | No | Yes | Yes |

## Generated Artifacts

Depending on the archetype, the skill generates:

**Simple**:
- `SKILL.md` (with inline instructions)

**Moderate**:
- `SKILL.md` (with workflow overview)
- `references/*.md` (detailed guidance files)

**Complex**:
- `SKILL.md` (with Phase/Stage/Step hierarchy)
- `references/workflow/**/*.md` (step reference files)
- `references/schemas/*.json` (validation schemas)
- `scripts/*.js` or `scripts/*.py` or `scripts/*.sh` (automation scripts)

## Best Practices Enforced

This skill enforces Agent Skill best practices:

- Name limited to 64 characters
- Description limited to 1024 characters
- Third-person voice in descriptions
- SKILL.md body under 500 lines
- One-level deep reference chains
- Consistent Phase/Stage/Step hierarchy
- Homogeneous step outputs with uniform validation

## Requirements

- Node.js (for validation scripts)
- Claude Code with Agent Skills support
