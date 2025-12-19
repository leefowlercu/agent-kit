# Determining Archetype Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Analyzing Requirements](#01--analyzing-requirements)
  - [02 / Applying Decision Matrix](#02--applying-decision-matrix)
  - [03 / Presenting Recommendation](#03--presenting-recommendation)
  - [04 / Documenting Decision](#04--documenting-decision)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on analyzing the gathered requirements to determine the appropriate skill archetype. The archetype decision affects the complexity and structure of the generated skill, ensuring it matches the user's needs without unnecessary overhead.

## Input Validation Criteria

This step requires validated output from Step 1 (Gathering Requirements).

**Required Input**: `skill-requirements.json` in the current working directory.

If this file does not exist or is invalid, you **MUST** return to Step 1 to gather and validate requirements before proceeding.

## Step Instructions

### 01 / Analyzing Requirements

Review the `skill-requirements.json` file and extract the complexity indicators:

1. **Multi-step Workflow**: Does the skill need distinct phases with user checkpoints?
2. **Validation Between Steps**: Does the skill need JSON schema validation for intermediate outputs?
3. **Automation Scripts**: Does the skill need executable scripts for automation?

For any indicator marked as "unsure", apply the following heuristics:

- **Multi-step Workflow**: If the skill's purpose involves multiple distinct activities (e.g., research then generation), recommend "Yes"
- **Validation Between Steps**: If the skill produces structured data that subsequent steps depend on, recommend "Yes"
- **Automation Scripts**: If the skill needs to perform file operations, API calls, or complex transformations, recommend "Yes"

### 02 / Applying Decision Matrix

Apply the following decision matrix to determine the recommended archetype:

| Indicator | Simple | Moderate | Complex |
|-----------|--------|----------|---------|
| Multi-step workflow | No | Yes | Yes |
| Validation between steps | No | No | Yes |
| Automation scripts | No | No | Yes |
| Reference files needed | No | Yes | Yes |

**Archetype Selection Rules**:

1. **Simple Archetype**: Select when ALL of the following are true:
   - No multi-step workflow needed
   - No validation between steps needed
   - No automation scripts needed
   - Skill can be expressed in a single SKILL.md file under 500 lines

2. **Moderate Archetype**: Select when ANY of the following are true (but automation/validation not needed):
   - Multi-step workflow is needed
   - Content exceeds what fits in a single SKILL.md
   - Multiple reference documents would improve organization

3. **Complex Archetype**: Select when ANY of the following are true:
   - Validation between steps is needed
   - Automation scripts are needed
   - Full Phase/Stage/Step hierarchy is beneficial

### 03 / Presenting Recommendation

Present the archetype recommendation to the user with clear rationale. Your presentation **MUST** include:

1. **Recommended Archetype**: State the archetype (Simple, Moderate, or Complex)

2. **Rationale**: Explain which requirements led to this recommendation:
   - List the complexity indicators and their values
   - Explain how the decision matrix was applied
   - Note any "unsure" indicators that were resolved with heuristics

3. **Archetype Description**: Briefly describe what this archetype means:
   - **Simple**: Single SKILL.md file with inline instructions
   - **Moderate**: SKILL.md with separate reference markdown files
   - **Complex**: Full Phase/Stage/Step hierarchy with schemas and scripts

4. **Override Option**: Explicitly offer the user the option to select a different archetype if they prefer

### 04 / Documenting Decision

After user confirmation (or override), update the requirements to include the archetype decision:

1. Read the existing `skill-requirements.json`
2. Add the `archetype` field with the confirmed value
3. Add the `archetypeRationale` field explaining the decision
4. Write the updated JSON back to `skill-requirements.json`

## Output Validation Criteria

### Output Format

The output format of this workflow step is an updated `skill-requirements.json` file with archetype information added.

### Output Content

The updated JSON **MUST** include the following additional fields:

```json
{
  "...existing fields...",
  "archetype": "simple" | "moderate" | "complex",
  "archetypeRationale": "..."
}
```

The `archetypeRationale` field **SHOULD** contain a brief explanation of why this archetype was selected, including which indicators influenced the decision.

### Internal Use

The archetype decision is used in subsequent steps to:
- Determine which template to use for SKILL.md generation
- Decide whether to generate workflow reference files
- Decide whether to generate JSON schemas
- Decide whether to generate automation scripts

You **MAY** inform the user that the updated requirements have been saved after the archetype decision is documented.
