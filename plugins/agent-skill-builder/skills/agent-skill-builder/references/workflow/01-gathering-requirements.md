# Gathering Requirements Workflow Step Reference

## Table of Contents

- [Purpose](#purpose)
- [Input Validation Criteria](#input-validation-criteria)
- [Step Instructions](#step-instructions)
  - [01 / Asking Questions](#01--asking-questions)
  - [02 / Presenting Gathered Information](#02--presenting-gathered-information)
- [Output Validation Criteria](#output-validation-criteria)
  - [Output Format](#output-format)
  - [Output Content](#output-content)
  - [Validation Process](#validation-process)
  - [Internal Use](#internal-use)

## Purpose

This workflow step reference provides guidance on gathering essential information from the user about the Agent Skill they need to create. Effective requirements gathering ensures the final skill meets the user's objectives and follows best practices for skill architecture.

## Input Validation Criteria

Since this is the first step in the workflow, no prior inputs are required. You **MAY** use prior contextual information about the user and their request to inform suggested answers during the "Asking Questions" stage, but you **MUST** explicitly confirm all required details with the user by following the workflow step instructions below.

## Step Instructions

### 01 / Asking Questions

You **MUST** use the `AskUserQuestion` tool to elicit information from the user. The `AskUserQuestion` tool can ask questions in sets, with up to four questions per set. By structuring the questions into sets, you can present intelligent suggestions for answers to questions in later sets based on the user's responses to questions in earlier sets.

You **MUST** ask the user a series of structured questions to gather basic requirements about the skill. The questions **MUST** be presented in sets, with the sets presented in the order defined below.

**Question Set 1: Basic Information**
  - **Question 1: Skill Name**
    - Header: "Name"
    - Question: "What should this skill be called? (This will appear in the YAML frontmatter)"
    - Options: Options for this question **SHOULD** include names known from prior context if available.
    - MultiSelect: false
  - **Question 2: Primary Purpose**
    - Header: "Purpose"
    - Question: "What is the primary purpose of this skill? What will it help users accomplish?"
    - Options: None (free text)
    - MultiSelect: false
  - **Question 3: Target Users**
    - Header: "Users"
    - Question: "Who are the target users for this skill?"
    - Options: None (free text)
    - MultiSelect: false

**Question Set 2: Invocation & Triggers**
  - **Question 1: Trigger Keywords**
    - Header: "Triggers"
    - Question: "What keywords or phrases should trigger this skill? (Select all that apply or add your own)"
    - Options: Options for this question **MUST** be intelligently generated based on the skill name and purpose from Question Set 1.
    - MultiSelect: true
  - **Question 2: Example User Requests**
    - Header: "Examples"
    - Question: "Provide 2-3 example user requests that should invoke this skill."
    - Options: None (free text)
    - MultiSelect: false

**Question Set 3: Complexity Indicators**
  - **Question 1: Multi-step Workflow**
    - Header: "Workflow"
    - Question: "Does this skill need a multi-step workflow with distinct phases?"
    - Options:
      - "Yes - The skill has multiple phases with user checkpoints"
      - "No - The skill is straightforward and linear"
      - "Unsure - Help me decide"
    - MultiSelect: false
  - **Question 2: Validation Between Steps**
    - Header: "Validation"
    - Question: "Does this skill need to validate outputs between steps (e.g., JSON schema validation)?"
    - Options:
      - "Yes - Outputs should be validated against schemas"
      - "No - No formal validation needed"
      - "Unsure - Help me decide"
    - MultiSelect: false
  - **Question 3: Automation Scripts**
    - Header: "Scripts"
    - Question: "Does this skill need automation scripts for execution?"
    - Options:
      - "Yes - Scripts are needed for automation"
      - "No - No scripts needed"
      - "Unsure - Help me decide"
    - MultiSelect: false
  - **Question 4: Script Language Preference**
    - Header: "Language"
    - Question: "If scripts are needed, what language do you prefer?"
    - Options:
      - "JavaScript + Bash"
      - "Python + Bash"
      - "No Preference"
    - MultiSelect: false

### 02 / Presenting Gathered Information

After collecting all required information, you **MUST** summarize the gathered requirements back to the user for confirmation. Arrange the information in a clear, organized format using Markdown syntax and request the user to confirm its accuracy before proceeding.

The summary **SHOULD** include:
- Skill name and purpose
- Target users
- Trigger keywords and example requests
- Complexity indicators (workflow, validation, scripts)
- Script language preference (if applicable)

## Output Validation Criteria

### Output Format

The output format of this workflow step is structured JSON. The JSON output **MUST** conform to the schema defined in `references/schemas/skill-requirements.schema.json`.

### Output Content

The output of this workflow step **MUST** be a confirmed set of skill requirements provided by the user. The output **MUST** include all the information gathered during this step in the following JSON structure:

```json
{
  "skillName": "...",
  "purpose": "...",
  "targetUsers": "...",
  "triggers": ["..."],
  "exampleRequests": ["..."],
  "complexityIndicators": {
    "multiStepWorkflow": true | false | "unsure",
    "validationBetweenSteps": true | false | "unsure",
    "automationScripts": true | false | "unsure"
  },
  "scriptLanguagePreference": "javascript" | "python" | "no-preference"
}
```

### Validation Process

After constructing the `skill-requirements.json` document, you **MUST** perform the following validation steps:

1. **Schema Validation**: From the skill root directory, run `scripts/validate-json.js` with the requirements schema:
   ```bash
   node scripts/validate-json.js \
     --schema references/schemas/skill-requirements.schema.json \
     --instance skill-requirements.json
   ```
   The script **MUST** report successful validation before you proceed.

2. **Validation Failure Handling**: If validation fails:
   - You **MUST** review the reported errors to identify which constraints were violated.
   - You **MUST** correct the JSON document to address the issues.
   - You **MUST** re-run the validation script until it succeeds.

3. **File Writing**: After successful validation, you **MUST** retain the JSON document as `skill-requirements.json` in the current working directory. This file serves as:
   - A transparent record of the gathered requirements for user review
   - A debugging artifact for skill development and troubleshooting
   - Input data for subsequent workflow steps

### Internal Use

Use this validated JSON representation internally to pass the confirmed requirements to the next workflow steps. You **MUST NOT** present the raw JSON to the user during the gathering process; it is for internal processing only. However, after writing the file to the CWD, you **MAY** inform the user that the requirements have been saved to `skill-requirements.json` for their records.
