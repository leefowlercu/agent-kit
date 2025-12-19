# Validating Skill Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Running Automated Validation](#01--running-automated-validation)
  - [02 / Reviewing Validation Results](#02--reviewing-validation-results)
  - [03 / Addressing Issues](#03--addressing-issues)
  - [04 / Presenting Validation Report](#04--presenting-validation-report)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Validation Categories](#validation-categories)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on validating the generated skill to ensure it meets all requirements and best practices. Validation catches issues before the skill is used in production.

## Input Validation Criteria

This step requires all generated artifacts from Phase 3. This step is the sole focus of Phase 4: Validation.

**Required Inputs**:
- Generated `SKILL.md`
- Generated reference files (if applicable)
- Generated schema files (if applicable)
- Generated script files (if applicable)

## Step Instructions

### 01 / Running Automated Validation

Execute the validation script against the generated skill:

**For Complex archetype with JavaScript scripts**:
```bash
node scripts/validate-skill.js /path/to/generated/skill
```

**For Complex archetype with Python scripts**:
```bash
python3 scripts/validate_skill.py /path/to/generated/skill
```

**For Simple/Moderate archetypes** (manual validation):
Perform the validation checks manually as outlined below.

### 02 / Reviewing Validation Results

Review each validation category:

**Frontmatter Validation**:
- [ ] `name` field exists
- [ ] `name` is ≤64 characters
- [ ] `name` contains no reserved words ("anthropic", "claude")
- [ ] `description` field exists
- [ ] `description` is non-empty
- [ ] `description` is ≤1024 characters
- [ ] `description` uses third-person voice

**Structure Validation**:
- [ ] SKILL.md exists at skill root
- [ ] SKILL.md body is under 500 lines
- [ ] All reference file links resolve to existing files
- [ ] Reference depth is one level (no nested references)
- [ ] Directory structure matches planned structure

**Content Validation**:
- [ ] Overview section exists
- [ ] Table of Contents exists with valid links
- [ ] Prerequisites section exists (Moderate/Complex)
- [ ] Workflow sections match planned hierarchy
- [ ] Consistent terminology throughout

**Script Validation** (Complex only):
- [ ] All scripts have valid syntax
- [ ] Scripts are executable
- [ ] Dependencies are documented

**Schema Validation** (Complex only):
- [ ] All schema files are valid JSON
- [ ] All schema files are valid JSON Schema
- [ ] Schema references in workflow steps are correct

### 03 / Addressing Issues

For each issue found:

1. **Categorize Severity**:
   - **ERROR**: Must be fixed before skill can be used
   - **WARNING**: Should be fixed but skill may still function
   - **INFO**: Suggestion for improvement

2. **Document Issue**: Record the issue, location, and recommended fix

3. **Apply Fix**: Make the necessary correction

4. **Re-validate**: Run validation again to confirm fix

### 04 / Presenting Validation Report

Present the validation results to the user:

**Report Format**:
```
Skill Validation Report: [Skill Name]
=====================================

Frontmatter:
  [PASS] name: valid (X chars)
  [PASS] description: valid (X chars)

Structure:
  [PASS] SKILL.md exists
  [PASS] SKILL.md body: X lines (under 500)
  [PASS] All references resolve (X files)
  [PASS] Reference depth: 1 level

Content:
  [PASS] Third-person description
  [WARN] Potential inconsistency: "X" vs "Y"

Scripts:
  [PASS] validate-json.js: syntax valid
  [PASS] validate-skill.js: syntax valid

Schemas:
  [PASS] skill-requirements.schema.json: valid
  [PASS] skill-structure.schema.json: valid

Overall: [PASS/FAIL] (X warnings)
```

## Output Validation Criteria

### Output Format

The output is a validation report presented to the user and optionally saved to a file.

### Validation Categories

| Category | Checks | Severity |
|----------|--------|----------|
| Frontmatter | name length, description length, voice | ERROR |
| Structure | file existence, line count, references | ERROR |
| Content | sections, consistency | WARNING |
| Scripts | syntax, executability | ERROR |
| Schemas | JSON validity, schema validity | ERROR |

### Internal Use

The validation report is used to:
- Confirm the generated skill is ready for use
- Identify issues that need to be addressed in the Refinement stage
- Provide documentation of the skill's compliance with best practices

You **MUST** inform the user of the overall validation result (PASS or FAIL) and highlight any issues that require attention.
