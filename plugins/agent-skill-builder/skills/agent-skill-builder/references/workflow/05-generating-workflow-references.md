# Generating Workflow References Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Identifying References to Generate](#01--identifying-references-to-generate)
  - [02 / Applying Workflow Step Template](#02--applying-workflow-step-template)
  - [03 / Generating Each Reference File](#03--generating-each-reference-file)
  - [04 / Validating Reference Integrity](#04--validating-reference-integrity)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Validation Checks](#validation-checks)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on generating the workflow step reference files for Moderate and Complex archetype skills. Each reference file provides detailed guidance for a specific step in the generated skill's workflow.

## Input Validation Criteria

This step applies only to **Moderate** and **Complex** archetypes.

**Required Inputs**:
- `skill-requirements.json` with archetype = "moderate" or "complex"
- `skill-structure.json` with workflow hierarchy defined
- Generated `SKILL.md` from Step 4

If the archetype is "simple", this step **SHOULD** be skipped.

## Step Instructions

### 01 / Identifying References to Generate

From `skill-structure.json`, extract the list of workflow reference files to generate:

1. Read the `fileManifest` array
2. Filter for files with `type` = "workflow-reference"
3. Sort by `generationOrder`

### 02 / Applying Workflow Step Template

Use the template at `references/templates/complex/workflow-step.template.md` as the base structure for each reference file.

**Required Sections for Each Reference**:
1. Title: `# [Step Name] Workflow Step Reference`
2. Table of Contents
3. Purpose
4. Input Validation Criteria
5. Step Instructions (with numbered sub-steps)
6. Output Validation Criteria

### 03 / Generating Each Reference File

For each reference file in the generation order:

**Sub-step 01: Generate Title and Table of Contents**
- Title matches the step name from the structure plan
- ToC includes all major sections and sub-steps

**Sub-step 02: Generate Purpose Section**
- Describe what this step accomplishes
- Explain how it fits in the overall workflow
- Keep concise (2-4 sentences)

**Sub-step 03: Generate Input Validation Criteria**
- List required inputs from prior steps
- Specify file names and expected content
- Include fallback instructions if inputs are missing

**Sub-step 04: Generate Step Instructions**
- Number sub-steps using `### NN / Action Name` format
- Each sub-step should be a discrete, actionable instruction
- Include specific tool usage guidance where applicable
- Include examples for complex operations

**Sub-step 05: Generate Output Validation Criteria**
- Specify output format (JSON, Markdown, etc.)
- Include output content template/example
- Define validation process (schema validation, manual checks)
- Specify internal use guidance

**Sub-step 06: Write the Reference File**
- Write to the path specified in the structure plan
- Ensure the directory structure exists

### 04 / Validating Reference Integrity

After generating all reference files:

1. **Link Validation**: Verify all links in SKILL.md resolve to generated files
2. **Depth Check**: Confirm no reference file links to another reference file
3. **Consistency Check**: Verify step numbers match across SKILL.md and reference files

## Output Validation Criteria

### Output Format

The output is multiple Markdown files, one per workflow step, located according to the structure plan.

### Validation Checks

Each generated reference file **MUST**:

1. **Structure**: Follow the standard reference file structure
2. **Numbering**: Use correct sub-step numbering format (`### NN / Action Name`)
3. **Completeness**: Include all five required sections
4. **Links**: Not contain links to other reference files (one-level deep rule)
5. **Homogeneity**: Define outputs that have uniform validation

### Internal Use

The generated reference files provide detailed guidance for each step of the skill's workflow. They are read by the agent when executing the generated skill. You **MUST** inform the user when all reference files have been generated and provide a summary of files created.
