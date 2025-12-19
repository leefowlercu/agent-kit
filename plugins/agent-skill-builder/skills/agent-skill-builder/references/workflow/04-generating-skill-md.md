# Generating SKILL.md Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Selecting Template](#01--selecting-template)
  - [02 / Generating Frontmatter](#02--generating-frontmatter)
  - [03 / Generating Overview Section](#03--generating-overview-section)
  - [04 / Generating Table of Contents](#04--generating-table-of-contents)
  - [05 / Generating Prerequisites Section](#05--generating-prerequisites-section)
  - [06 / Generating Workflow Section](#06--generating-workflow-section)
  - [07 / Validating Generated Content](#07--validating-generated-content)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Validation Checks](#validation-checks)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on generating the main SKILL.md file for the skill being built. The SKILL.md is the entry point for any Agent Skill and must follow specific formatting and structural requirements.

## Input Validation Criteria

This step requires validated outputs from Steps 1-3.

**Required Inputs**:
- `skill-requirements.json` with archetype decision
- `skill-structure.json` with complete structure plan

If these files do not exist or are invalid, you **MUST** return to the appropriate prior step.

## Step Instructions

### 01 / Selecting Template

Based on the archetype in `skill-requirements.json`, select the appropriate template:

- **Simple**: Use `references/templates/simple/SKILL.template.md`
- **Moderate**: Use `references/templates/moderate/SKILL.template.md`
- **Complex**: Use `references/templates/complex/SKILL.template.md`

### 02 / Generating Frontmatter

Generate the YAML frontmatter with two required fields:

```yaml
---
name: [Skill Name from requirements]
description: [Generated description based on purpose and triggers]
---
```

**Frontmatter Requirements**:
- `name`: Friendly name with spaces, maximum 64 characters
- `description`: Third-person voice, maximum 1024 characters, describes what the skill does AND when to use it

**Description Generation Guidelines**:
- Start with an action verb in third person (e.g., "Assists", "Creates", "Generates")
- Include the primary capability
- Include trigger keywords/phrases for when to invoke the skill
- Do NOT use first person ("I can...") or second person ("You can use...")

### 03 / Generating Overview Section

Generate the Overview section that describes:
1. What the skill does
2. Who the target users are
3. What archetypes or modes are supported (if applicable)

Keep this section concise - detailed information belongs in reference files.

### 04 / Generating Table of Contents

Generate a Table of Contents with links to all major sections:
- Overview
- Table of Contents (self-reference)
- Prerequisites
- Workflow sections (Phases, Stages, Steps for Complex archetype)

### 05 / Generating Prerequisites Section

Generate the Prerequisites section based on archetype:

**Simple Archetype**:
- May be omitted if no prerequisites exist

**Moderate/Complex Archetype**:
```markdown
# Prerequisites

**Before starting the workflow** you **MUST**:
1. Present complete workflow structure (Phases, Stages, Steps) to user
2. Explain Phase approval gates
3. Wait for user acknowledgment
```

### 06 / Generating Workflow Section

Generate the Workflow section based on archetype and structure plan:

**Simple Archetype**:
- Generate inline instructions directly in SKILL.md

**Moderate Archetype**:
- Generate workflow overview
- Reference separate markdown files for detailed guidance

**Complex Archetype**:
- Generate Important Workflow Guidelines
- Generate Phase sections with Stage and Step subsections
- Include Phase Approval Gates between phases
- Reference workflow step files using relative paths from `skill-structure.json`

**Phase/Stage/Step Naming**:
- Phases: `## Phase N: [Name]`
- Stages: `### Stage N: [Name]` with `**Objective**: [objective]`
- Steps: `#### Step N: [Name]` with reference link

### 07 / Validating Generated Content

Before finalizing, validate the generated SKILL.md:

1. **Line Count**: Body must be under 500 lines
2. **Frontmatter**: Name ≤64 chars, description ≤1024 chars
3. **References**: All reference links must use correct relative paths
4. **Structure**: Must match the planned structure from `skill-structure.json`

## Output Validation Criteria

### Output Format

The output is a single Markdown file: `SKILL.md` in the skill's root directory.

### Validation Checks

The generated SKILL.md **MUST** pass these checks:

1. **Frontmatter Validation**:
   - `name` field exists and is ≤64 characters
   - `description` field exists, is non-empty, and is ≤1024 characters
   - Description uses third-person voice
   - No reserved words ("anthropic", "claude") in name

2. **Structure Validation**:
   - Body is under 500 lines
   - Table of Contents exists and links are valid
   - All reference file links resolve to planned files

3. **Content Validation**:
   - Overview section exists
   - Prerequisites section exists (for Moderate/Complex)
   - Workflow section matches planned hierarchy

### Internal Use

The generated SKILL.md serves as the foundation for the skill. Subsequent steps will generate the files it references. You **MUST** inform the user when SKILL.md generation is complete and provide a brief summary of its contents.
